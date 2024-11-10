from django.urls import path
from .views import ReportView, ExcelReportView

urlpatterns = [
    path('/statistics', ReportView.as_view(), name='export_statistics'),
    path('/export', ExcelReportView.as_view(), name='export_excel'),
]