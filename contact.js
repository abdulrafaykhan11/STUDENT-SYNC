document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const formContainer = document.getElementById('registrationFormContainer');
    const idCardContainer = document.getElementById('idCardContainer');
    const canvas = document.getElementById('idCanvas');
    const ctx = canvas.getContext('2d');
    const downloadBtn = document.getElementById('downloadBtn');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validation Rules
    const validationRules = {
        fullName: { regex: /^[A-Za-z\s]{3,50}$/, error: "Name must be 3-50 characters, letters only." },
        fatherName: { regex: /^[A-Za-z\s]{3,50}$/, error: "Name must be 3-50 characters, letters only." },
        cnic: { regex: /^\d{5}-\d{7}-\d{1}$/, error: "Format must be XXXXX-XXXXXXX-X." },
        dob: { 
            validate: (val) => {
                if (!val) return false;
                const dobDate = new Date(val);
                const today = new Date();
                let age = today.getFullYear() - dobDate.getFullYear();
                const m = today.getMonth() - dobDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
                    age--;
                }
                return age >= 15 && age <= 60;
            }, 
            error: "You must be between 15 and 60 years old." 
        },
        gender: { validate: (val) => val !== '', error: "Please select your gender." },
        qualification: { regex: /^.{3,100}$/, error: "Please enter your previous qualification." },
        email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Please enter a valid email address." },
        phone: { regex: /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/, error: "Enter valid Pakistani phone number." }
    };

    const inputs = form.querySelectorAll('input, select');

    // Setup UI for each input
    inputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const icon = document.createElement('i');
        icon.className = 'validation-icon fa-solid';
        wrapper.appendChild(icon);

        const errorText = document.createElement('small');
        errorText.className = 'error-text';
        errorText.style.display = 'none';
        wrapper.parentNode.appendChild(errorText);

        input.addEventListener('input', () => validateInput(input, icon, errorText));
        input.addEventListener('blur', () => validateInput(input, icon, errorText));
        input.addEventListener('change', () => validateInput(input, icon, errorText));
    });

    function validateInput(input, icon, errorText) {
        const id = input.id;
        const rule = validationRules[id];
        if (!rule) return true;

        let isValid = false;
        if (rule.regex) {
            isValid = rule.regex.test(input.value.trim());
        } else if (rule.validate) {
            isValid = rule.validate(input.value.trim());
        }

        if (input.value.trim() === '') {
            input.classList.remove('is-valid', 'is-invalid');
            icon.className = 'validation-icon fa-solid';
            errorText.style.display = 'none';
            checkFormValidity();
            return false;
        }

        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            icon.className = 'validation-icon fa-solid fa-circle-check';
            errorText.style.display = 'none';
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            icon.className = 'validation-icon fa-solid fa-circle-xmark';
            errorText.textContent = rule.error;
            errorText.style.display = 'block';
        }
        
        checkFormValidity();
        return isValid;
    }

    function checkFormValidity() {
        let allValid = true;
        inputs.forEach(input => {
            const id = input.id;
            const rule = validationRules[id];
            if (!rule) return;
            
            let isValid = false;
            if (rule.regex) {
                isValid = rule.regex.test(input.value.trim());
            } else if (rule.validate) {
                isValid = rule.validate(input.value.trim());
            }
            if (!isValid) allValid = false;
        });

        if (allValid) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.disabled = false;
        } else {
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.disabled = true;
        }
    }

    // Initial check to disable button
    checkFormValidity();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Generate random roll number
        const randomRoll = 'CS-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

        // Collect data
        const data = {
            name: document.getElementById('fullName').value.toUpperCase(),
            fatherName: document.getElementById('fatherName').value.toUpperCase(),
            cnic: document.getElementById('cnic').value,
            dob: document.getElementById('dob').value,
            rollNo: randomRoll,
            issueDate: new Date().toLocaleDateString('en-GB')
        };

        // Save roll number to canvas dataset for downloading later
        canvas.dataset.rollNo = randomRoll;

        // Switch views
        formContainer.style.display = 'none';
        idCardContainer.style.display = 'flex';

        // Draw ID Card
        drawIdCard(data);
    });

    function drawIdCard(data) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header Background
        const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        headerGradient.addColorStop(0, '#800020'); // Crimson
        headerGradient.addColorStop(1, '#ff4081'); // Coral
        
        ctx.fillStyle = headerGradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(canvas.width, 180);
        ctx.quadraticCurveTo(canvas.width / 2, 230, 0, 180);
        ctx.fill();

        // Header Text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 32px Arial';
        ctx.fillText('STUDENTSYNC', canvas.width / 2, 60);
        ctx.font = '16px Arial';
        ctx.fillText('KARACHI INSTITUTE OF TECHNOLOGY', canvas.width / 2, 90);
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#ffb6c1';
        ctx.fillText('STUDENT IDENTITY CARD', canvas.width / 2, 120);

        // Profile Picture Placeholder (Circle)
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 230, 80, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        
        // Draw icon inside placeholder
        ctx.fillStyle = '#cccccc';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 210, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 290, 45, Math.PI, 0);
        ctx.fill();

        // Student Details
        ctx.fillStyle = '#1f2833';
        ctx.textAlign = 'center';
        
        // Name
        ctx.font = 'bold 26px Arial';
        ctx.fillText(data.name, canvas.width / 2, 350);
        
        // Father Name
        ctx.fillStyle = '#8b0000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText("S/D of " + data.fatherName, canvas.width / 2, 380);

        // Info Table style
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0b0c10';
        ctx.font = 'bold 16px Arial';
        
        const startX = 60;
        let startY = 430;
        const lineSpacing = 35;

        // Labels
        ctx.fillText('ROLL NO', startX, startY);
        ctx.fillText('CNIC NO', startX, startY + lineSpacing);
        ctx.fillText('D.O.B', startX, startY + lineSpacing * 2);
        ctx.fillText('ISSUED', startX, startY + lineSpacing * 3);

        // Values
        ctx.font = '16px Arial';
        const valueX = 180;
        ctx.fillText(`:  ${data.rollNo}`, valueX, startY);
        ctx.fillStyle = '#ff4081';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`:  ${data.cnic}`, valueX, startY + lineSpacing);
        ctx.fillStyle = '#0b0c10';
        ctx.font = '16px Arial';
        ctx.fillText(`:  ${data.dob}`, valueX, startY + lineSpacing * 2);
        ctx.fillText(`:  ${data.issueDate}`, valueX, startY + lineSpacing * 3);

        // Bottom Footer Bar
        ctx.fillStyle = '#1f2833';
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = '12px Arial';
        ctx.fillText('This card is property of StudentSync. If found, please return to campus.', canvas.width / 2, canvas.height - 15);

        // Barcode Mockup (Lines)
        ctx.fillStyle = '#000000';
        const barStartX = canvas.width / 2 - 100;
        const barY = 570;
        for (let i = 0; i < 40; i++) {
            const width = Math.random() * 4 + 1;
            ctx.fillRect(barStartX + (i * 5), barY, width, 25);
        }
    }

    // Download functionality
    downloadBtn.addEventListener('click', () => {
        // Convert canvas to data URL
        const imageURI = canvas.toDataURL('image/png');
        
        // Retrieve the roll number saved earlier
        const rollNo = canvas.dataset.rollNo || '0000';

        // Create an anchor element and trigger download
        const a = document.createElement('a');
        a.href = imageURI;
        a.download = `StudentSync_ID_${rollNo}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});

// ── Mobile Hamburger Menu ──
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');

    if (navContainer && navLinks && !document.querySelector('.mobile-menu-btn')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Toggle menu');
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

        const navActions = navContainer.querySelector('.nav-actions');
        if (navActions) {
            navContainer.insertBefore(menuBtn, navActions);
        } else {
            navContainer.appendChild(menuBtn);
        }

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }
});
