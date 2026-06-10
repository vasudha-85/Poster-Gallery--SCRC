import os
import qrcode


def generate_qr_code(
    url: str,
    output_path: str
):

    os.makedirs(
        os.path.dirname(
            output_path
        ),
        exist_ok=True
    )

    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=4
    )

    qr.add_data(
        url
    )

    qr.make(
        fit=True
    )

    image = qr.make_image(
        fill_color="black",
        back_color="white"
    )

    image.save(
        output_path
    )

    return output_path