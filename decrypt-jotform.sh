
echo "$A" | base64 -D | openssl rsautl  -inkey jotform.key -decrypt