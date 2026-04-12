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

    print(f"[OTP] +91{phone}: {otp} (expires in {OTP_EXPIRY_MINUTES} min)", flush=True)

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
                        "otp_channel": "sms",
                    },
                )
            data = resp.json()
            if data.get("type") == "success":
                print(f"[OTP] WhatsApp OTP sent to +91{phone}", flush=True)
            else:
                print(f"[OTP] MSG91 response: {data.get('message')} (OTP still valid in DB)", flush=True)
        except Exception as e:
            print(f"[OTP] MSG91 send failed: {e} (OTP still valid in DB)", flush=True)
    else:
        print("[OTP] MSG91 not configured — check Render logs for OTP", flush=True)


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
