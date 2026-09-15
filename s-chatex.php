<?php
$logFile = "chat_log.txt";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'fetch') {
        if (file_exists($logFile) && filesize($logFile) > 0) {
            echo file_get_contents($logFile);
        } else {
            echo "<p style='color:#888; text-align:center; margin-top:20px;'>No hay mensajes. ¡Di hola!</p>";
        }
        exit;
    }

    if (isset($_POST['action']) && $_POST['action'] === 'clear') {
        if (file_exists($logFile)) {
            file_put_contents($logFile, "");
        }
        exit;
    }

    if (isset($_POST['username']) && isset($_POST['message'])) {
        $username = htmlspecialchars(trim($_POST['username']));
        $message = htmlspecialchars(trim($_POST['message']));
        $time = date('H:i');

        if (!empty($username) && !empty($message)) {
            $line = "<div style='margin-bottom:8px;'>[{$time}] <b>{$username}:</b> {$message}</div>\n";
            file_put_contents($logFile, $line, FILE_APPEND);
        }
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat PHP Global</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 20px auto;
            padding: 0 10px;
            background-color: #f4f7f6;
        }
        .chat-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h2 {
            margin-top: 0;
            color: #333;
            text-align: center;
        }
        #chat-box {
            height: 300px;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow-y: scroll;
            padding: 15px;
            background: #fafafa;
            margin-bottom: 15px;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        .btn {
            width: 100%;
            padding: 10px;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .btn-send {
            background-color: #28a745;
        }
        .btn-send:hover {
            background-color: #218838;
        }
        .btn-clear {
            background-color: #dc3545;
            font-size: 14px;
            padding: 8px;
        }
        .btn-clear:hover {
            background-color: #bd2130;
        }
    </style>
</head>
<body>

<div class="chat-container">
    <h2>Chat Global PHP</h2>
    <div id="chat-box">Cargando mensajes...</div>
    
    <input type="text" id="username" placeholder="Tu Nombre o Apodo" maxlength="20">
    <input type="text" id="message" placeholder="Escribe un mensaje y presiona Enter..." maxlength="255">
    
    <button class="btn btn-send" onclick="sendMessage()">Enviar Mensaje</button>
    <button class="btn btn-clear" onclick="clearChat()">Borrar Historial Global</button>
</div>

<script>
    const chatBox = document.getElementById('chat-box');
    const filename = '<?php echo basename(__FILE__); ?>';

    function loadMessages() {
        fetch(filename, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=fetch'
        })
        .then(response => response.text())
        .then(data => {
            const shouldScroll = chatBox.scrollTop + chatBox.clientHeight >= chatBox.scrollHeight - 30;
            chatBox.innerHTML = data;
            if (shouldScroll) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        });
    }

    function sendMessage() {
        const userField = document.getElementById('username');
        const msgField = document.getElementById('message');
        
        const user = userField.value.trim() || 'Anónimo';
        const msg = msgField.value.trim();
        
        if (!msg) return;

        userField.disabled = true;

        fetch(filename, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(user)}&message=${encodeURIComponent(msg)}`
        }).then(() => {
            msgField.value = '';
            loadMessages();
        });
    }

    function clearChat() {
        if (confirm("¿Estás seguro de que quieres borrar el chat para TODOS los dispositivos?")) {
            fetch(filename, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=clear'
            }).then(() => {
                loadMessages();
            });
        }
    }

    document.getElementById('message').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    setInterval(loadMessages, 2000);
    loadMessages();
</script>
</body>
</html>
