import { Typography } from "@mui/material";
import '../css/general.css'


function getFeatureText(featureId, value){
    var title = ""
    var text = ""

    switch (featureId){
        case "has_ip":
            title = "IP Address"
            text = `Uses an IP address of ${value} instead of a domain name.`
            break;
        case "has_at":
            title = "Uses @ Symbol"
            text = `The URL contains '@'; the browser ignores everything before it, so the the real site is ${value}.`
            break;
        case "has_port":
            title = "Uses Port Number"
            text = `The URL specifies an unusual port number of ${value}.`
            break;
        case "suspicious_tld":
            title = "Suspicious Top Level Domain"
            text = `The comain ends in .${value}, a top-level domain often abused for phishing.`
            break;
        case "brand_not_in_domain":
            title = "Brand Domain Mismatch"
            text = `The URL mentions brand names; ${value.join(", ")}, but the domain of the site does not use the brand/s. This is an suggests the URL is attempting impersonate a familar brand.`
            break;
        case "suspicious_words":
            title = "Suspicious Words Used"
            text = `Contains login/account words: ${value.join(", ")}.`
            break;
        case "is_shortener":
            title = "Uses a Shortener"
            text = `Uses a link shortener ${value}, which hides the real destination.`
            break;
        case "num_hyphens_host":
            title = "Number of Hyphens"
            text = `Domain has ${value} hyphens, common in look-alike domains.`
            break;
        case "num_dots_host":
            title = "Number of Dots"
            text = `The URL has ${value} dots in the host, which means ${value} subdomains.`
            break;
        case "url_length":
            title = "Length of URL"
            text = `The url has an address ${value} characters long.`
            break;
        case "path_length":
            title = "Length of URL Path"
            text = `The url has a path ${value} characters long.`
            break;
        case "host_length":
            title = "Length of Host"
            text = `The url has a host ${value} characters long.`
            break;
        case "digit_ratio":
            title = "Digit to Character Ratio"
            text = `${value*100}% of the address is digits, e.g. random tokens.`
            break;
        case "num_digits":
            title = "Number of Digits"
            text = `${value} digits.`
            break;
        case "num_special":
            title = "Number of Special Characters"
            text = `${value} special characters.`
            break;
        case "path_depth":
            title = "URL Path Depth"
            text = `Url's path had a depth of ${value}.`
            break;
        case "host_entropy":
            title = "Entropy (Randomness) of Host"
            text = `Url's host had an entropy of ${Math.round(value*100)/100}.`
            break;
        case "has_encoding":
            title = "Uses Encoding"
            text = `The Url constains encoding.`
            break;
        
    }

    return [title, text]
}

export default function featureDetails({featureId, value})
{
    console.log("feature: " + typeof(featureId))
    console.log("value: " + typeof(value))
    const [title, text] = getFeatureText(featureId, value)
    return(
        <div className="feature-desc">
            <Typography variant="h6">{title}</Typography>
            <Typography>{text}</Typography>
        </div>
    )
}