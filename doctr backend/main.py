from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from doctr.io import DocumentFile
from doctr.models import ocr_predictor
import uvicorn
import tempfile
import cv2
import numpy as np
from PIL import Image
import io
import logging
import traceback
import google.generativeai as genai
import filetype

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the OCR model once at startup
logger.info("Loading OCR model...")
try:
    ocr_model = ocr_predictor(pretrained=True)
    logger.info("OCR model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load OCR model: {str(e)}")
    raise

genai.configure(api_key="AIzaSyA_mnfbATFXoa64l2RMAHoJ_-q-RFLEfw8")

def preprocess_image_bytes(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(
        blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2
    )
    return Image.fromarray(thresh)

@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    temp_file = None
    try:
        logger.info(f"Received file: {file.filename}")
        content = await file.read()
        logger.info(f"File size: {len(content)} bytes")

        # Preprocess image using OpenCV
        preprocessed_pil = preprocess_image_bytes(content)
        preprocessed_pil.save("preprocessed.jpg")  # For debugging

        # OCR with doctr
        doc = DocumentFile.from_images(preprocessed_pil)
        result = ocr_model(doc)

        # Log all detected lines for debugging
        for page in result.pages:
            for block in page.blocks:
                for line in block.lines:
                    logger.info("LINE: %s", " ".join([w.value for w in line.words]))

        # Extract text blocks with their positions (as before)
        blocks = []
        for page in result.pages:
            for block in page.blocks:
                for line in block.lines:
                    text = " ".join([word.value for word in line.words])
                    if text.strip():
                        blocks.append({
                            "text": text,
                            "bbox": line.geometry,
                            "confidence": min(word.confidence for word in line.words)
                        })
        blocks.sort(key=lambda x: x["bbox"][0][1])

        # Extract structured data (as before)
        structured_data = {}
        for block in blocks:
            text = block["text"].lower().strip()
            logger.info(f"Processing text block: {text}")
            if not text:
                continue
            for field in [
                "order no", "order date", "customer name", "shipping address",
                "city", "state", "item name", "hsn code", "packing",
                "quantity", "total quantity", "tax percent", "tax amount",
                "rate", "amount", "net payable"
            ]:
                if field in text:
                    value = text.split(field, 1)[1].strip()
                    if value:
                        field_key = ''.join(word.capitalize() if i > 0 else word.lower() 
                                          for i, word in enumerate(field.split()))
                        structured_data[field_key] = value
                        logger.info(f"Extracted {field_key}: {value}")
                    break

        logger.info("OCR processing completed successfully")
        logger.info(f"Extracted structured data: {structured_data}")
        return {
            "success": True,
            "data": {
                "text_blocks": blocks,
                "structured_data": structured_data,
                "raw": result.export()
            },
            "message": "Document processed successfully"
        }
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            "success": False,
            "error": "Error processing document",
            "details": str(e)
        }
    finally:
        if temp_file:
            try:
                import os
                os.unlink(temp_file)
                logger.info(f"Cleaned up temporary file: {temp_file}")
            except Exception as cleanup_error:
                logger.error(f"Error cleaning up temporary file: {str(cleanup_error)}")

@app.post("/extract-invoice")
async def extract_invoice(file: UploadFile = File(...)):
    image_bytes = await file.read()
    # Detect image type using filetype
    kind = filetype.guess(image_bytes)
    if kind is None or kind.mime not in ['image/jpeg', 'image/png']:
        return {"success": False, "error": "Unsupported image type. Please upload a JPG or PNG image."}
    mime_type = kind.mime

    prompt = """
    Extract and structure the fields into JSON. Return ONLY raw JSON, no markdown formatting or explanations.
    Use null for empty fields. Do not wrap the response in code blocks or add any additional text.

    {
        "Order No": null,
        "Date": null,
        "Customer Name": null,
        "Correspondence Address": null,
        "City": null,
        "State": null,
        "Shipping Address": null,
        "Item Name": null,
        "HSN Code": null,
        "Packaging": null,
        "Quantity": null,
        "Total Quantity": null,
        "Tax %": null,
        "Tax Amount": null,
        "Rate": null,
        "Amount": null,
        "Net Payable": null
    }
    """
    # Use the latest Gemini model
    model = genai.GenerativeModel("gemini-1.5-flash")
    try:
        response = model.generate_content([
            prompt,
            {"mime_type": mime_type, "data": image_bytes}
        ])
        result_text = response.text
        
        # Clean up the response text by removing markdown code block formatting
        result_text = result_text.replace('```json', '').replace('```', '').strip()
        
        return {
            "success": True,
            "structured_data": result_text
        }
    except Exception as e:
        print("Gemini API error:", e)
        traceback.print_exc()
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001) 