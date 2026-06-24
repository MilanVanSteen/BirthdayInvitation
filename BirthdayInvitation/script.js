function getVisitorId() {
    let id = localStorage.getItem("visitorId");

    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("visitorId", id);
    }

    return id;
}

const visitorId = getVisitorId();

console.log("Visitor ID:", visitorId);
document.addEventListener("DOMContentLoaded", () => {
    console.log("Attendees raw:", localStorage.getItem("attendees"));
});

window.addEventListener("load", () => {
    const attendees =
        JSON.parse(localStorage.getItem("attendees")) || [];

    const existingAttendee = attendees.find(
        a => a.visitorId === visitorId
    );

    if (existingAttendee) {
        document.getElementById("nameInput").value =
            existingAttendee.name;

        console.log("Welcome back:", existingAttendee);
    } else {
        console.log("New visitor");
    }
});



function openEnvelope() {
    const envelope = document.getElementById("envelope");
    const letter = document.getElementById("letter");
    const gif = document.getElementById("gif");

    envelope.classList.add("open");

    // Small delay so letter opens first
    setTimeout(() => {
        letter.classList.add("show");
    }, 300);
}

function showRSVP() {
    document
        .getElementById("rsvpScreen")
        .classList.add("show");
}

function submitRSVP() {
    const input = document.getElementById("nameInput");
    const name = input.value.trim();

    const fail = document.getElementById("failMessage");
    const success = document.getElementById("successMessage");

    if (!name) {
        fail.textContent = "Je moet wel een naam invullen dumbass...";
        success.textContent = "";
        return;
    }

    let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

    const existingAttendee = attendees.find(
        a => a.visitorId === visitorId
    );

    if (existingAttendee) {
        existingAttendee.name = name;
        console.log("Updated attendee:", existingAttendee);
    }
    else {
        attendees.push({
            visitorId: visitorId,
            name: name
        });
        console.log("New attendee added:", name);
    }

    localStorage.setItem(
        "attendees",
        JSON.stringify(attendees)
    );

    console.log("All attendees:", attendees);

    fail.textContent = "";
    success.textContent = "🎉 Tot dan!";
}

function handleNo() {
    submitNoRSVP();
    showNoScreen();
}

function submitNoRSVP() {
    let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

    // verwijder uit lijst
    attendees = attendees.filter(
        a => a.visitorId !== visitorId
    );

    localStorage.setItem("attendees", JSON.stringify(attendees));

    console.log("Removed attendee:", visitorId);
}

function showNoScreen() {
    document.getElementById("noScreen").classList.add("show");
}

function closeNoScreen() {
    document.getElementById("noScreen").classList.remove("show");
}