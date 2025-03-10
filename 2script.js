/* script.js */
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (email && password) {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("portfolio-form").style.display = "block";
    } else {
      alert("Please enter valid email and password");
    }
  }
  
  // Helper to convert an uploaded image file to base64
  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
  
  async function submitPortfolio() {
    // Retrieve form data
    const fullName = document.getElementById("full-name").value;
    const jobTitle = document.getElementById("job-title").value;
    const contact = document.getElementById("contact").value;
    const bio = document.getElementById("bio").value;
    const softSkills = document.getElementById("soft-skills").value;
    const technicalSkills = document.getElementById("technical-skills").value;
    const institute = document.getElementById("institute").value;
    const degree = document.getElementById("degree").value;
    const year = document.getElementById("year").value;
    const grade = document.getElementById("grade").value;
    const company = document.getElementById("company").value;
    const duration = document.getElementById("duration").value;
    const responsibilities = document.getElementById("responsibilities").value;
    const projects = document.getElementById("projects").value;
  
    // Validate required fields
    if (!fullName || !jobTitle || !contact || !bio) {
      alert("Please fill in all required fields (Full Name, Job Title, Contact, Bio).");
      return;
    }
  
    // Convert user photo to base64 (if provided)
    let imgData = "";
    const photoFile = document.getElementById("photo").files[0];
    if (photoFile) {
      try {
        imgData = await convertImageToBase64(photoFile);
      } catch (err) {
        console.error("Error reading image file:", err);
      }
    }
  
    // Destructure jsPDF from the UMD build
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "pt", "letter");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    /* --------------------- LEFT (DARK) PANEL --------------------- */
    doc.setFillColor(34, 34, 34); // dark gray
    doc.rect(0, 0, 200, pageHeight, "F");
  
    // (A) Add user photo at x=30, y=20, w=140, h=160 (adjust as needed)
    if (imgData) {
      let format = "JPEG";
      if (imgData.indexOf("image/png") !== -1) {
        format = "PNG";
      }
      doc.addImage(imgData, format, 30, 20, 140, 160);
    }
  
    // We'll continue the left panel content below the photo
    let leftY = 200;
  
    // (B) About Me
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("About Me", 30, leftY);
    leftY += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let aboutLines = doc.splitTextToSize(bio, 140);
    doc.text(aboutLines, 30, leftY);
    leftY += aboutLines.length * 12 + 10;
  
    // (C) Contact
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Contact", 30, leftY);
    leftY += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let contactLines = doc.splitTextToSize(contact, 140);
    doc.text(contactLines, 30, leftY);
    leftY += contactLines.length * 12 + 10;
  
    // (D) Skills
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Skills", 30, leftY);
    leftY += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let skillsText = `Soft Skills: ${softSkills}\nTechnical Skills: ${technicalSkills}`;
    let skillsLines = doc.splitTextToSize(skillsText, 140);
    doc.text(skillsLines, 30, leftY);
    leftY += skillsLines.length * 12 + 20;
  
    /* --------------------- TOP-RIGHT NAME SECTION --------------------- */
    // Draw a background rectangle at the top-right
    const nameBoxHeight = 120;
    doc.setFillColor(240, 240, 240); // light gray background
    doc.rect(200, 0, pageWidth - 200, nameBoxHeight, "F");
  
    // Place the name and job title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(fullName, 220, 50);
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(253, 188, 44); // highlight color
    doc.text(jobTitle, 220, 75);
  
    // We'll start the main content on the right side below this section
    let rightX = 220;
    let rightY = 140;
  
    /* --------------------- EXPERIENCE --------------------- */
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Experience", rightX, rightY);
    rightY += 20;
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (company || duration || responsibilities) {
      let expHeader = `${company || ""} ${duration ? "(" + duration + ")" : ""}`;
      doc.text(expHeader, rightX, rightY);
      rightY += 12;
      if (responsibilities) {
        let respLines = doc.splitTextToSize(responsibilities, 350);
        doc.text(respLines, rightX, rightY);
        rightY += respLines.length * 12 + 20;
      }
    } else {
      doc.text("No work experience provided.", rightX, rightY);
      rightY += 20;
    }
  
    /* --------------------- EDUCATION --------------------- */
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Education", rightX, rightY);
    rightY += 20;
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (institute || degree || year || grade) {
      let eduText = "";
      if (degree) eduText += degree;
      if (institute) eduText += " from " + institute;
      if (year) eduText += " (" + year + ")";
      if (grade) eduText += " | Grade: " + grade;
  
      let eduLines = doc.splitTextToSize(eduText, 350);
      doc.text(eduLines, rightX, rightY);
      rightY += eduLines.length * 12 + 20;
    } else {
      doc.text("No academic background provided.", rightX, rightY);
      rightY += 20;
    }
  
    /* --------------------- PROJECTS / PUBLICATIONS --------------------- */
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Projects / Publications", rightX, rightY);
    rightY += 20;
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (projects) {
      let projLines = doc.splitTextToSize(projects, 350);
      doc.text(projLines, rightX, rightY);
      rightY += projLines.length * 12 + 20;
    } else {
      doc.text("No projects/publications provided.", rightX, rightY);
      rightY += 20;
    }
  
    // Finally, save the PDF
    doc.save(`${fullName}-Portfolio.pdf`);
  }
  