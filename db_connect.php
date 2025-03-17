
<?php
// Database credentials
$host = 'your-db-host';
$dbname = 'your-db-name';
$username = 'your-db-username';
$password = 'your-db-password';

// Create a connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
