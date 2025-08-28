<?php
// Define the Google Apps Script URL
$url = 'https://script.google.com/macros/s/AKfycbxS40tNgRk2-y4qdNrR0wkMyjKahchlaaprzIh2O9OIP903Kgkd8AB1fSmCVlii5o4/exec';

// Define a status message variable to be displayed on the page
$statusMessage = '';
$messageColor = '';

// Check if the form was submitted using the POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize and get form data
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Hardcoded user authentication for demonstration purposes
    // In a real application, this should be handled securely, e.g., via a database
    if ($username === "admin" && $password === "1234") {
        
        // Prepare data to send to the Google Apps Script
        $formData = http_build_query([
            'username' => $username,
            'password' => $password,
            'name' => $name,
            'email' => $email,
            'message' => $message
        ]);

        // Initialize a cURL session to send the data
        $ch = curl_init();
        
        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $formData);

        // Execute cURL and get the response
        $response = curl_exec($ch);

        // Check for cURL errors
        if (curl_errno($ch)) {
            $statusMessage = 'حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.';
            $messageColor = 'text-red-500';
        } else {
            // Check the response from Google Apps Script
            if (trim($response) === "Success") {
                $statusMessage = 'تم إرسال البيانات بنجاح!';
                $messageColor = 'text-green-500';
            } else {
                $statusMessage = 'حدث خطأ في الإرسال: ' . trim($response);
                $messageColor = 'text-red-500';
            }
        }

        // Close cURL session
        curl_close($ch);
    } else {
        // Handle authentication failure
        $statusMessage = 'خطأ: اسم المستخدم أو كلمة المرور غير صحيح.';
        $messageColor = 'text-red-500';
    }
}
?>

<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نموذج تسجيل البيانات بكلمة مرور</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Tajawal', sans-serif;
            direction: rtl;
        }
        .btn-send {
            transition: all 0.2s ease-in-out;
            transform: scale(1);
        }
        .btn-send:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .btn-send:active {
            transform: scale(0.98);
        }
    </style>
</head>
<body class="bg-gray-900 p-4 min-h-screen flex flex-col items-center justify-center text-white">

    <div class="p-8 rounded-lg shadow-lg max-w-md w-full" style="background-color: #000000;">
        <div class="flex flex-col items-center mb-6">
            <!-- Software Lab Logo -->
            <img src="https://abinadwan.github.io/lab/Icon.png" alt="شعار مختبر البرمجيات" class="w-20 h-20 mb-2">
            <h2 class="text-2xl font-bold text-center">مختبر البرمجيات</h2>
        </div>
        
        <!-- Form Container -->
        <form id="dataForm" class="space-y-4" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
            <!-- User Authentication Fields -->
            <div>
                <label for="username" class="block text-sm font-medium">اسم المستخدم:</label>
                <input type="text" id="username" name="username" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 text-gray-800">
            </div>

            <div>
                <label for="password" class="block text-sm font-medium">كلمة المرور:</label>
                <input type="password" id="password" name="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 text-gray-800">
            </div>

            <!-- Main Data Fields -->
            <div>
                <label for="name" class="block text-sm font-medium">الاسم:</label>
                <input type="text" id="name" name="name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 text-gray-800">
            </div>
            
            <div>
                <label for="email" class="block text-sm font-medium">البريد الإلكتروني:</label>
                <input type="email" id="email" name="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 text-gray-800">
            </div>
            
            <div>
                <label for="message" class="block text-sm font-medium">الرسالة:</label>
                <textarea id="message" name="message" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 text-gray-800"></textarea>
            </div>
            
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white btn-send" style="background-color: #000080;">
                إرسال البيانات
            </button>
        </form>

        <!-- Status Message Display -->
        <?php if (!empty($statusMessage)) { ?>
            <div id="statusMessage" class="mt-4 text-center">
                <p class="<?php echo $messageColor; ?>"><?php echo $statusMessage; ?></p>
            </div>
        <?php } ?>
    </div>
    
    <!-- Footer -->
    <footer class="mt-8 text-center text-sm text-white">
        جميع الحقوق محفوظة &copy; 2025
    </footer>
</body>
</html>
