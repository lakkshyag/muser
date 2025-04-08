import { useEffect } from "react";

// the bandaid fix for handling back buttno presses.
// basically what id does is, block the back button on first click
// then on subsequent clicks if offers the window prompt
// which can be used however
const useDetectBackButton = (onBackConfirm) => {
  useEffect(() => {
    console.log("Setting up back button detection");
    window.history.pushState({ lobby: true }, "", window.location.href); // pushing a dummy on the stack
    
    const handlePopState = (event) => {
      console.log("Back button was pressed", event);
      
      const confirmed = window.confirm("Are you sure you want to leave the lobby?");
      if (confirmed && typeof onBackConfirm === 'function') { // check
        console.log("Executing leave lobby function");
        onBackConfirm(); // if proper, we do the back thing
      } else {
        console.log("Navigation cancelled, pushing state back"); // else stay here
        window.history.pushState({ lobby: true }, "", window.location.href);
      }
    };
    
    window.addEventListener("popstate", handlePopState);   // handle in case browser back is pressed;
    return () => {
      console.log("Cleaning up back button detection");
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBackConfirm]);
};

export default useDetectBackButton;