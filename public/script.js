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

window.addEventListener("load", async () => {
    try {
        const res = await fetch("/attendees");
        const attendees = await res.json();

        const existing = attendees.find(a => a.visitorId === visitorId);

        if (existing) {
            document.getElementById("nameInput").value = existing.name;
            console.log("Welcome back:", existing);
        } else {
            console.log("New visitor");
        }
    } catch (err) {
        console.error("Error loading attendees:", err);
    }
});

function openEnvelope() {
    const envelope = document.getElementById("envelope");
    const letter = document.getElementById("letter");

    envelope.classList.add("open");

    // Small delay so letter opens first
    setTimeout(() => {
        letter.classList.add("show");
    }, 300);
}

function showRSVP() {
    document.getElementById("rsvpScreen").classList.add("show");
}

async function submitRSVP() {
    const name = document.getElementById("nameInput").value.trim();

    const fail = document.getElementById("failMessage");
    const success = document.getElementById("successMessage");

    if (!name) {
        fail.textContent = "Je moet wel een naam invullen dumbass...";
        success.textContent = "";
        return;
    }

    try {
        await fetch("/rsvp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                visitorId,
                name
            })
        });

        console.log("RSVP saved:", name);

        fail.textContent = "";
        success.textContent = "🎉 Tot dan!";
    } catch (err) {
        console.error("RSVP error:", err);
        fail.textContent = "Er ging iets mis...";
    }
}

// function submitRSVP() {
//     const input = document.getElementById("nameInput");
//     const name = input.value.trim();

//     const fail = document.getElementById("failMessage");
//     const success = document.getElementById("successMessage");

//     if (!name) {
//         fail.textContent = "Je moet wel een naam invullen dumbass...";
//         success.textContent = "";
//         return;
//     }

//     let attendees = JSON.parse(localStorage.getItem("attendees")) || [];
//     const existingAttendee = attendees.find(
//         a => a.visitorId === visitorId
//     );

//     if (existingAttendee) {
//         existingAttendee.name = name;
//         console.log("Updated attendee:", existingAttendee);
//     }
//     else {
//         attendees.push({
//             visitorId: visitorId,
//             name: name
//         });
//         console.log("New attendee added:", name);
//     }

//     localStorage.setItem(
//         "attendees",
//         JSON.stringify(attendees)
//     );

//     console.log("All attendees:", attendees);

//     fail.textContent = "";
//     success.textContent = "🎉 Tot dan!";
// }

// function handleNo() {
//     submitNoRSVP();
//     showNoScreen();
// }

async function handleNo() {
    try {
        await fetch("/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visitorId })
        });

        console.log("Removed RSVP");

        showNoScreen();
    } catch (err) {
        console.error("Remove error:", err);
    }
}

// function submitNoRSVP() {
//     let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

//     // Remove from list
//     attendees = attendees.filter(
//         a => a.visitorId !== visitorId
//     );

//     localStorage.setItem("attendees", JSON.stringify(attendees));

//     console.log("Removed attendee:", visitorId);
// }

function showNoScreen() {
    document.getElementById("noScreen").classList.add("show");
}

function closeNoScreen() {
    document.getElementById("noScreen").classList.remove("show");
}

const nameInput = document.getElementById("nameInput");

nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitRSVP();
    }
});