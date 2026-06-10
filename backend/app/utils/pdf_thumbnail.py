import fitz


def generate_pdf_thumbnail(
    pdf_path: str,
    thumbnail_path: str
):

    document = fitz.open(
        pdf_path
    )

    page = document.load_page(
        0
    )

    pix = page.get_pixmap(
        matrix=fitz.Matrix(
            2,
            2
        )
    )

    pix.save(
        thumbnail_path
    )

    document.close()

    return thumbnail_path