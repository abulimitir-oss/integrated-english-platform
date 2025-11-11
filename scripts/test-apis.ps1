# 测试 Conversation API
Write-Host "`n🧪 Testing CONVERSATION API..."
$conversationBody = @{
    scenario = 'coffee_shop'
    message = 'I would like to order a coffee please'
    history = @()
} | ConvertTo-Json

$conversationResponse = Invoke-RestMethod `
    -Uri 'http://localhost:3000/api/conversation' `
    -Method Post `
    -ContentType 'application/json' `
    -Body $conversationBody

Write-Host "Response:" ($conversationResponse | ConvertTo-Json -Depth 10)

# 测试 Grammar API
Write-Host "`n🧪 Testing GRAMMAR API..."
$grammarBody = @{
    text = 'I have went to the store yesterday'
} | ConvertTo-Json

$grammarResponse = Invoke-RestMethod `
    -Uri 'http://localhost:3000/api/grammar' `
    -Method Post `
    -ContentType 'application/json' `
    -Body $grammarBody

Write-Host "Response:" ($grammarResponse | ConvertTo-Json -Depth 10)

# 测试 TTS API
Write-Host "`n🧪 Testing TTS API..."
$ttsBody = @{
    text = 'Welcome to our English learning platform'
    voice = 'en-US-JennyNeural'
} | ConvertTo-Json

$ttsResponse = Invoke-RestMethod `
    -Uri 'http://localhost:3000/api/tts' `
    -Method Post `
    -ContentType 'application/json' `
    -Body $ttsBody

Write-Host "Response:" ($ttsResponse | ConvertTo-Json -Depth 10)

Write-Host "`n✅ API Tests Completed"