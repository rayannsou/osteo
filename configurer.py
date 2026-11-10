#!/usr/bin/env python3
"""Remplace les valeurs « __XXX__ » par celles de ton projet Firebase.
Usage : python3 configurer.py API_KEY PROJECT_ID SENDER_ID APP_ID VAPID_KEY"""
import sys
if len(sys.argv) != 6: sys.exit(__doc__)
k = dict(zip(['__API_KEY__','__PROJECT_ID__','__SENDER_ID__','__APP_ID__','__VAPID_KEY__'], sys.argv[1:]))
for f in ['index.html','firebase-messaging-sw.js']:
    t = open(f, encoding='utf8').read()
    for a, b in k.items(): t = t.replace(a, b)
    open(f, 'w', encoding='utf8').write(t)
print('OK : configuration appliquée.')
