import importlib.util,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('qr',Path(__file__).resolve().parents[1]/'scripts/generate-qr.py')
qr=importlib.util.module_from_spec(spec);spec.loader.exec_module(qr)
class QRTests(unittest.TestCase):
 def test_public_https(self):
  self.assertEqual(qr.validate_url('https://restaurant.github.io/menu/'),'https://restaurant.github.io/menu/')
 def test_local_and_temporary_rejected(self):
  for value in ['http://site.com','https://localhost','https://127.0.0.1','https://192.168.0.5/menu','https://[::1]/','https://demo.local','https://test.invalid','https://x.ngrok.io','https://user:pass@site.com','https://site.com/#menu']:
   with self.subTest(value=value),self.assertRaises(ValueError):qr.validate_url(value)
if __name__=='__main__':unittest.main()
