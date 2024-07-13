<?php
require 'vendor/autoload.php'; // include Composer's autoloader

$mongoClient = new MongoDB\Client("mongodb+srv://ttwalaskhandisa:gcTl7R8qJJ74XZre@loader-database.rpikfug.mongodb.net/?retryWrites=true&w=majority&appName=loader-database");
$collection = $mongoClient->loada->companies;

$company_name = $_POST['company_name'];
$bank_name = $_POST['bank_name'];
$account_number = $_POST['account_number'];
$branch_code = $_POST['branch_code'];
$tracker_link = $_POST['tracker_link'];
$trucks = $_POST['trucks'];

$company = [
    'name' => $company_name,
    'bank_name' => $bank_name,
    'account_number' => $account_number,
    'branch_code' => $branch_code,
    'tracker_link' => $tracker_link,
    'trucks' => array_map(function($truck) {
        return ['registration_number' => $truck];
    }, $trucks)
];

$result = $collection->insertOne($company);

if ($result->getInsertedCount() == 1) {
    echo "Company registered successfully";
} else {
    echo "Error registering company";
}
?>
