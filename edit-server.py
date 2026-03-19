#!/usr/bin/env python3
"""
Servidor local para salvar edições do blog StatisticsReal.
Roda na porta 8080 e recebe o HTML editado via POST, gravando
direto no arquivo .md do post (preservando o front matter).

Uso: python3 edit-server.py
"""

import json
import os
import re
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 8080
CONTENT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "content")


class EditHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "http://localhost:1313")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path != "/save":
            self.send_response(404)
            self.end_headers()
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8")

        try:
            data = json.loads(body)
            filepath = data.get("filepath", "")
            new_content = data.get("content", "")
        except (json.JSONDecodeError, KeyError) as e:
            self._send_error(400, f"JSON inválido: {e}")
            return

        # Segurança: impedir path traversal
        if ".." in filepath or filepath.startswith("/"):
            self._send_error(400, "Caminho inválido")
            return

        full_path = os.path.join(CONTENT_DIR, filepath)
        if not os.path.isfile(full_path):
            # Tenta com o diretório content/ já no path
            alt_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), filepath)
            if os.path.isfile(alt_path):
                full_path = alt_path
            else:
                self._send_error(404, f"Arquivo não encontrado: {filepath}")
                return

        try:
            with open(full_path, "r", encoding="utf-8") as f:
                original = f.read()

            # Extrair front matter (entre os dois ---)
            match = re.match(r"(---\s*\n.*?\n---\s*\n)", original, re.DOTALL)
            if match:
                front_matter = match.group(1)
            else:
                front_matter = ""

            # Escrever front matter + novo conteúdo HTML
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(front_matter)
                f.write("\n")
                f.write(new_content)
                f.write("\n")

            self._send_json(200, {"status": "ok", "file": filepath})
            print(f"✓ Salvo: {filepath}")

        except Exception as e:
            self._send_error(500, f"Erro ao gravar: {e}")

    def _send_json(self, code, data):
        self.send_response(code)
        self._set_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def _send_error(self, code, message):
        print(f"✗ Erro {code}: {message}")
        self._send_json(code, {"error": message})

    def log_message(self, format, *args):
        # Silenciar logs do OPTIONS, manter só os relevantes
        if "OPTIONS" not in str(args):
            super().log_message(format, *args)


if __name__ == "__main__":
    server = HTTPServer(("localhost", PORT), EditHandler)
    print(f"Edit server rodando em http://localhost:{PORT}")
    print(f"Diretório de conteúdo: {CONTENT_DIR}")
    print("Ctrl+C para parar\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor parado.")
        server.server_close()
