import random
import logging
from datetime import datetime, timedelta, timezone
import httpx
from app.config import MSG91_AUTH_KEY, MSG91_TEMPLATE_ID
from app.database import database

logger = logging.getLogger(__name__)

otps_collection = database["otps"]

OTP_EXPIRY_MINUTES = 5


async def generate_and_send_otp(phone: str) -> None:
    otp = str(random.randint(100000, 999999))

    await otps_collection.delete_many({"phone": phone})
    await otps_collection.insert_one({
        "phone": phone,
        "otp": otp,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES),
        "created_at": datetime.now(timezone.utc),
    })

    logger.info("OTP for +91%s: %s (expires in %d min)", phone, otp, OTP_EXPIRY_MINUTES)

    if MSG91_AUTH_KEY and MSG91_TEMPLATE_ID:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    "https://control.msg91.com/api/v5/otp",
                    headers={"authkey": MSG91_AUTH_KEY},
                    json={
                        "template_id": MSG91_TEMPLATE_ID,
                        "mobile": f"91{phone}",
                        "otp": otp,
                        "otp_length": 6,
                    },
                )
            data = resp.json()
            if data.get("type") == "success":
                logger.info("MSG91 SMS sent to +91%s", phone)
            else:
                logger.warning("MSG91 response: %s (OTP still valid in DB)", data.get("message"))
        except Exception as e:
            logger.warning("MSG91 send failed: %s (OTP still valid in DB)", e)
    else:
        logger.info("MSG91 not configured — check Render logs for OTP")


async def verify_stored_otp(phone: str, otp: str) -> bool:
    record = await otps_collection.find_one({
        "phone": phone,
        "otp": otp,
        "expires_at": {"$gt": datetime.now(timezone.utc)},
    })
    if record:
        await otps_collection.delete_many({"phone": phone})
        return True
    return False
