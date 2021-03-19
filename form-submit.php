<?php

$output = array(
    "status" => "error",
    "num" => "500",
    "text" => "Error unknown"
);



// PREPARE DATA
//////////////////////////////////////////


$allowed_fields = array(
    "contact-name" => "Contact Name: ",
    "position" => "Position: ",
    "school-district" => "School District: ",
    "telephone" => "Telephone: ",
    "email" => "Email: ",
    "comments" => "Comments/Questions: ",
);


$posted = !empty($_GET['formdata']) ? $_GET['formdata'] : false;

$data = array();
$posteddata = (array)json_decode($posted);
foreach( $allowed_fields as $f => $lbl ) {

    $data[$f] = !empty($posteddata[$f]) ? $posteddata[$f] : false;

    // sanitize !!
    $data[$f] = htmlspecialchars($data[$f], ENT_COMPAT,'UTF-8', true);
    
    //$data[$f] = $data[$f];
}


// VALIDATION
//////////////////////////////////////////
$valid = true;



if( empty($data['contact-name'])) {
    $output = array(
        "status" => "error",
        "num" => "411",
        "text" => "Please enter your name."
    );
    $valid = false;
}
if( empty($data['telephone']) && empty($data['email'])) {
    $output = array(
        "status" => "error",
        "num" => "411",
        "text" => "Please enter your telephone or email."
    );
    $valid = false;
}




// SEND EMAIL
//////////////////////////////////////////
$subject = 'New message from '.$data['contact-name'];
$message = '<h2>New Message - royerstudios.education</h2> <p>';
foreach( $allowed_fields as $f => $lbl) {
    //$message .= $lbl . " " . $data[$f] . "<br /> ";
    $message .= "<b>{$lbl}</b> {$data[$f]}<br /> ";
}
$message .= '</p><br><h4>Thank you</h4>';

$reply = !empty($data['email']) ? $data['email'] : "info@royerstudios.com";
$to      = 'info@royerstudios.com';
//$to      = 'bouletap@gmail.com';

$headers = 'From: info@royerstudios.com' . "\r\n" .
    'Reply-To: ' .$reply. "\r\n" .
    'Bcc: dev@bouletap.com' . "\r\n" .
    'Content-Type: text/html; charset=UTF-8' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

if( !$valid ) {
    // $output as is (already built)
}
else if( mail($to, $subject, $message, $headers) ) { // true ) { //
    
    $output = array(
        "status" => "success",
        "num" => "400",
        "text" => "mail sent"
    );
}
else {

    $output = array(
        "status" => "error",
        "num" => "300",
        "text" => "fatal error - mail not sent"
    );    
}


echo json_encode($output);
die();

