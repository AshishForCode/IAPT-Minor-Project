import urllib.request, urllib.error, json
url = 'http://localhost:5000/api/auth/login'
req = urllib.request.Request(url, method='POST', data=json.dumps({'email':'test@example.com','password':'1234'}).encode('utf-8'), headers={'Content-Type':'application/json'})
try:
    with urllib.request.urlopen(req, timeout=5) as r:
        print('status', r.status)
        print(r.read().decode('utf-8'))
except urllib.error.HTTPError as err:
    print('HTTPError', err.code)
    print(err.read().decode('utf-8'))
except Exception as e:
    print('ERROR', repr(e))
