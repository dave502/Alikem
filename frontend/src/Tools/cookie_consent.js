
import { Center, Container } from "@chakra-ui/react";
import CookieConsent from "react-cookie-consent";

function CookieConsentBottom() {

    return (
        <CookieConsent
            style={{
                background: "#2f855a",
                // width: "30%",
                justifyContent: "center",
                fontSize: "16px",
            }}
            buttonStyle={{ color: "#4e503b", fontSize: "16px", marginBottom:"10px", marginTop:"5px" }}
            contentStyle={{flex: "0 0 100%", textAlign: "center",  margin:"5px"}}
            location="bottom"
            buttonText="I agree!"
            cookieName="AlikemCookieConsent"
            expires={150}
        >
            {/* <span style={{ fontSize: "10px" }}>This bit of text is smaller :O</span> */}
            This site uses cookies to store user preferences and for authentication purposes
        </CookieConsent>
    )
}

export default CookieConsentBottom;