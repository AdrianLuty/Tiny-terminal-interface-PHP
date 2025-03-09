<?php
$command = array();
$command['photo'] = array(
    'description' => 'This is your profile picture',
    'operation' => 'showProfileImage',
    'picture' => 'lion.jpg'
);
$command['hello'] = array(
    'description' => 'Greeting command',
    'operation' => 'Hello, developer!'
);

$command['date'] = array(
    'description' => 'Command that displays the date and time',
    'operation' => 'date'
);

$command['cls'] = array(
    'description' => 'Clear console',
    'operation' => 'clear'
);

$command['help'] = array(
    'description' => 'Displays this list of commands',
    'operation' => 'showHelp'
);

header('Content-Type: application/json');
echo json_encode($command);
?>
