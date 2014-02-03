<?
# Define target page
//$target = "http://library.books24x7.com/bookshelf.asp?site=BVX7V";
$target = "http://proxy.ulib.iupui.edu:81/cgi-bin/nph-ezpxauth.pl";
$proxy = "http://proxy.ulib.iupui.edu:81/cgi-bin/nph-ezpxauth.pl";

# Define login credentials for this page
$credentials = "rt-hemonc:hemonc";

$useragent="Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1";


# Create the cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
curl_setopt($ch, CURLOPT_VERBOSE,true); 
curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
curl_setopt($ch, CURLOPT_HEADER, 1); 
curl_setopt ($ch, CURLOPT_REFERER, $target); 
curl_setopt($ch, CURLOPT_HTTPPROXYTUNNEL, 1); 
curl_setopt($ch, CURLOPT_PROXY, $proxy); 
curl_setopt($ch, CURLOPT_PROXYUSERPWD, $credentials); 

curl_setopt($ch, CURLOPT_URL, $target);             // Define target site
curl_setopt($ch, CURLOPT_USERPWD, $credentials);    // Send credentials
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);     // Return page in string


# Echo page
$page = curl_exec($ch);                             // Place web page into a string
echo $page;                                         // Echo downloaded page

# Close the cURL session
curl_close($ch);
?>

