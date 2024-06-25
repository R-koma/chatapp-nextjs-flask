# クラスターでの実行

## client

```
cd client
```

```
npm install socket.io-client
```

```
npm run dev
```

### 複数のポートを立ち上げる場合は、上記のnpm run devに加えて以下のコマンドを実行する。

```
PORT=3001 npm run dev
```

PORT番号は自分の使用したい番号で問題ないです。

## server

```
cd server
```

```
python3 -m venv venv
```

```
source venv/bin/activate
```

### Windowsの場合は `venv\Scripts\activate`

```
pip freeze > requirements.txt
```

```
pip install -r requirements.txt
```

```
python init_db.py
```

```
python app.py
```

# chatapp-nextjs-flask-single-thread
