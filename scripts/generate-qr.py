import argparse,ipaddress
from pathlib import Path
from urllib.parse import urlsplit

def validate_url(value):
 p=urlsplit(value)
 if p.scheme!='https' or not p.hostname or p.username or p.password or p.fragment:
  raise ValueError('Use a final public HTTPS URL without credentials or a fragment.')
 host=p.hostname.lower().rstrip('.')
 if '.' not in host or host.endswith(('.localhost','.local','.test','.invalid','.example')) or host=='localhost':
  raise ValueError('Local and test URLs are not allowed. Use your permanent deployed URL.')
 try:
  address=ipaddress.ip_address(host)
 except ValueError: pass
 else:
  if not address.is_global: raise ValueError('Private IP addresses are not allowed.')
 if any(label in host for label in ('ngrok','trycloudflare','localtunnel')):
  raise ValueError('Temporary tunnel URLs are not allowed.')
 return value

def main():
 parser=argparse.ArgumentParser(description='Create a print-ready QR code for the permanent restaurant menu URL.')
 parser.add_argument('url',type=validate_url)
 args=parser.parse_args()
 try:
  import qrcode
  import qrcode.image.svg
 except ImportError: parser.exit(1,'Install the QR dependency: python -m pip install -r scripts/requirements-qr.txt\n')
 output=Path(__file__).resolve().parents[1]/'assets'/'qr';output.mkdir(parents=True,exist_ok=True)
 qr=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q,box_size=16,border=4)
 qr.add_data(args.url);qr.make(fit=True)
 qr.make_image(fill_color='black',back_color='white').save(output/'rabi-menu.png')
 qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).save(output/'rabi-menu.svg')
 (output/'destination.txt').write_text(args.url+'\n',encoding='utf-8')
 print('Created assets/qr/rabi-menu.png and rabi-menu.svg. Scan it with both iPhone and Android before printing.')
if __name__=='__main__': main()
