import mimetypes
import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import io

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def detect_receipt(file):
    """
    Analiza un archivo y determina si parece un comprobante de pago usando OCR.
    Retorna: {"verified": bool, "confidence": float, "found": list[str]}
    """
    mime, _ = mimetypes.guess_type(file.name)
    text = ""

    # 1️⃣ Extraer texto con OCR según el tipo
    if mime and mime.startswith("image/"):
        image = Image.open(file)
        text = pytesseract.image_to_string(image)
    elif mime == "application/pdf":
        pdf_bytes = file.read()
        pdf = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in pdf:
            text += page.get_text()
    else:
        return {"verified": False, "confidence": 0.0, "reason": "Formato no soportado"}

    # 2️⃣ Analizar palabras clave comunes en comprobantes
    keywords = [
        "pago", "transferencia", "banco", "referencia", "folio",
        "cuenta", "monto", "fecha", "beneficiario", "comprobante",
        "transacción", "clabe", "bbva", "banorte", "santander", "scotiabank",
        "cuenta destino","cuenta origen", "fecha de operación"
    ]
    matches = [kw for kw in keywords if kw.lower() in text.lower()]
    confidence = len(matches) / len(keywords)
    verified = confidence > 0.30  # Umbral ajustable

    return {
        "verified": verified,
        "confidence": round(confidence, 2),
        "found": matches[:5],
        "sample_text": text[:300]  # para debug
    }
