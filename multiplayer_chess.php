
<?php
// Sample database or file-based storage for multiplayer session
$games = file_get_contents("chess_sessions.json");
$games = json_decode($games, true);

// Check if a user is trying to join a game or create a new one
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];  // either "join" or "create"
    $gameId = $_POST['gameId'];  // The game ID entered by the user
    $password = $_POST['password'];  // The password entered by the user

    // Handle Game Creation
    if ($action == 'create') {
        // Check if game ID already exists
        if (isset($games[$gameId])) {
            echo json_encode(['status' => 'error', 'message' => 'Game ID already exists.']);
        } else {
            // Create a new game session
            $games[$gameId] = [
                'password' => $password,
                'players' => ['player1' => null, 'player2' => null],  // Empty slots for two players
                'status' => 'waiting'  // Waiting for players
            ];
            file_put_contents("chess_sessions.json", json_encode($games));
            echo json_encode(['status' => 'success', 'message' => 'Game created successfully.']);
        }
    }

    // Handle Game Joining
    elseif ($action == 'join') {
        // Check if game ID exists
        if (isset($games[$gameId])) {
            // Check password
            if ($games[$gameId]['password'] == $password) {
                // Assign player to the first empty slot
                if ($games[$gameId]['players']['player1'] === null) {
                    $games[$gameId]['players']['player1'] = $_POST['playerName'];
                } elseif ($games[$gameId]['players']['player2'] === null) {
                    $games[$gameId]['players']['player2'] = $_POST['playerName'];
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Game already full.']);
                    return;
                }

                // Change status if both players are joined
                if ($games[$gameId]['players']['player1'] !== null && $games[$gameId]['players']['player2'] !== null) {
                    $games[$gameId]['status'] = 'started';
                }
                
                file_put_contents("chess_sessions.json", json_encode($games));
                echo json_encode(['status' => 'success', 'message' => 'Joined game successfully!']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Incorrect password.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Game ID does not exist.']);
        }
    }
}
?>
