<template>
    <div>
        <h2>PDF Viewer</h2>
        <input type="file" @change="onFileChange" />
        <canvas id="pdf-canvas" ref="pdfCanvas"></canvas>
    </div>
</template>

<script>
import { PDFDocument } from 'pdfjs'; // Import từ thư viện pdfjs

export default {
    name: "PdfViewer",
    data() {
        return {
            pdfDoc: null,  // Tài liệu PDF
        };
    },
    methods: {
        // Khi người dùng chọn file
        onFileChange(e) {
            const file = e.target.files[0];
            if (file && file.type === "application/pdf") {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const typedArray = new Uint8Array(event.target.result);
                    this.loadPDF(typedArray);
                };
                reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
            } else {
                alert("Vui lòng chọn file PDF hợp lệ.");
            }
        },

        // Hàm để tải và hiển thị PDF
        async loadPDF(pdfData) {
            try {
                // Tạo đối tượng PDFDocument từ dữ liệu PDF
                const pdf = await PDFDocument.load(pdfData);
                this.pdfDoc = pdf;
                this.renderPage(1); // Hiển thị trang đầu tiên
            } catch (error) {
                console.error("Lỗi khi tải PDF:", error);
            }
        },

        // Hàm hiển thị trang PDF
        async renderPage(pageNum) {
            try {
                const page = await this.pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.5 });

                const canvas = this.$refs.pdfCanvas;
                const ctx = canvas.getContext("2d");

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport,
                };

                // Hiển thị trang lên canvas
                page.render(renderContext);
            } catch (error) {
                console.error("Lỗi khi hiển thị trang PDF:", error);
            }
        },
    },
};
</script>

<style scoped>
canvas {
    border: 1px solid black;
    margin-top: 10px;
}
</style>