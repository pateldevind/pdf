// Load Header and Footer Components
document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    fetch('/components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Load Footer
    fetch('/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));

    // Initialize AdSense
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }

    // Initialize Tool Search
    initializeToolSearch();
});

// Tool Search Functionality
function initializeToolSearch() {
    const searchInput = document.getElementById('searchTools');
    if (!searchInput) return;

    const tools = [
        { name: 'JPG to PDF', category: 'Create PDF', url: '/tools/jpg-to-pdf.html' },
        { name: 'Word to PDF', category: 'Create PDF', url: '/tools/word-to-pdf.html' },
        { name: 'HTML to PDF', category: 'Create PDF', url: '/tools/html-to-pdf.html' },
        { name: 'PDF to JPG', category: 'Convert PDF', url: '/tools/pdf-to-jpg.html' },
        { name: 'PDF to Word', category: 'Convert PDF', url: '/tools/pdf-to-word.html' },
        { name: 'PDF to Excel', category: 'Convert PDF', url: '/tools/pdf-to-excel.html' },
        { name: 'Rotate PDF', category: 'Edit PDF', url: '/tools/rotate-pdf.html' },
        { name: 'Add Page Numbers', category: 'Edit PDF', url: '/tools/add-page-numbers.html' },
        { name: 'Add Watermark', category: 'Edit PDF', url: '/tools/add-watermark.html' },
        { name: 'PowerPoint to PDF', category: 'Office to PDF', url: '/tools/powerpoint-to-pdf.html' },
        { name: 'Excel to PDF', category: 'Office to PDF', url: '/tools/excel-to-pdf.html' }
    ];

    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.toLowerCase();

        searchTimeout = setTimeout(() => {
            const results = tools.filter(tool => 
                tool.name.toLowerCase().includes(searchTerm) || 
                tool.category.toLowerCase().includes(searchTerm)
            );

            displaySearchResults(results);
        }, 300);
    });
}

// Display Search Results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="p-3">No tools found</div>';
        return;
    }

    const resultsHTML = results.map(tool => `
        <a href="${tool.url}" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${tool.name}</h6>
                <small class="text-muted">${tool.category}</small>
            </div>
        </a>
    `).join('');

    searchResults.innerHTML = resultsHTML;
}

// Newsletter Subscription
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('newsletter-form')) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Here you would typically send this to your backend
        console.log('Newsletter subscription:', email);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success mt-3';
        successMessage.textContent = 'Thank you for subscribing!';
        e.target.appendChild(successMessage);
        
        // Clear form
        e.target.reset();
        
        // Remove success message after 3 seconds
        setTimeout(() => successMessage.remove(), 3000);
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add Loading State to Buttons
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';
        }
    });
});

// Handle file uploads for PDF tools
function handleFileUpload(inputElement, allowedTypes = ['application/pdf']) {
    const files = inputElement.files;
    const errors = [];

    // Validate files
    for (let file of files) {
        if (!allowedTypes.includes(file.type)) {
            errors.push(`File "${file.name}" is not a supported format.`);
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            errors.push(`File "${file.name}" exceeds the 10MB size limit.`);
        }
    }

    return { files, errors };
}

// Show error messages
function showError(message, containerId = 'error-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = message ? `<div class="alert alert-danger">${message}</div>` : '';
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Show success messages
function showSuccess(message, containerId = 'success-container') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="alert alert-success">${message}</div>`;
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Loading indicator
function toggleLoading(show, loadingText = 'Processing...') {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        if (show) {
            loader.classList.remove('d-none');
        } else {
            loader.classList.add('d-none');
        }
    }
} 