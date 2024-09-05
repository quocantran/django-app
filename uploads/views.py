from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import cloudinary.uploader
from .serializers import UploadedFileSerializer
from datetime import datetime

class FileUploadAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UploadedFileSerializer(data=request.data)
        if serializer.is_valid():
            file = request.FILES['fileUpload']
            try:
                upload_result = cloudinary.uploader.upload(file)
                file_url = upload_result.get('url')
                return Response({'url': file_url, 'uploaded_at': datetime.now()}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)