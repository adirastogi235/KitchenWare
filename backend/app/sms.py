import httpx
from app.config import MSG91_AUTH_KEY, MSG91_TEMPLATE_ID

MSG91_SEND_URL = "https://control.msg91.com/api/v5/otp"
MSG91_VERIFY_URL = "https://control.msg91.com/api/v5/otp/verify"
MSG91_RESEND_URL = "https://control.msg91.com/api/v5/otp/retry"


async def send_otp(phone: str) -> dict:
    mobile = f"91{phone}"
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            MSG91_SEND_URL,
            headers={"authkey": MSG91_AUTH_KEY},
            json={
                "template_id": MSG91_TEMPLATE_ID,
                "mobile": mobile,
                "otp_length": 6,
            },
        )
    data = resp.json()
    if resp.status_code != 200 or data.get("type") == "error":
        raise Exception(data.get("message", "Failed to send OTP"))
    return data


async def verify_otp(phone: str, otp: str) -> dict:
    mobile = f"91{phone}"
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            MSG91_VERIFY_URL,
            headers={"authkey": MSG91_AUTH_KEY},
            params={"mobile": mobile, "otp": otp},
        )
    data = resp.json()
    if resp.status_code != 200 or data.get("type") == "error":
        raise Exception(data.get("message", "OTP verification failed"))
    return data


async def resend_otp(phone: str, retry_type: str = "text") -> dict:
    mobile = f"91{phone}"
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            MSG91_RESEND_URL,
            headers={"authkey": MSG91_AUTH_KEY},
            json={"mobile": mobile, "retrytype": retry_type},
        )
    data = resp.json()
    if resp.status_code != 200 or data.get("type") == "error":
        raise Exception(data.get("message", "Failed to resend OTP"))
    return data
