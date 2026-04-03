from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["example"])


@router.get("/example")
def get_example():
    return {"data": "This is an example endpoint"}
