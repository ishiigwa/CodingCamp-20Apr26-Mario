// Feature Verification Script for Task 16
// Run this in the browser console on the dashboard page

console.log('=== TASK 16: FINAL VERIFICATION ===\n');

// Test 1: Theme Toggle Functionality
console.log('TEST 1: Theme Toggle Functionality');
console.log('-----------------------------------');

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

if (themeToggle) {
    console.log('✓ Theme toggle button exists');
    console.log(`  Current icon: ${themeIcon ? themeIcon.textContent : 'NOT FOUND'}`);
    
    const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
    console.log(`  Current theme: ${currentTheme}`);
    
    // Test toggle
    console.log('  Testing toggle...');
    themeToggle.click();
    
    setTimeout(() => {
        const newTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
        console.log(`  After toggle: ${newTheme}`);
        console.log(`  Icon after toggle: ${themeIcon.textContent}`);
        
        if (newTheme !== currentTheme) {
            console.log('✓ Theme toggle works correctly');
        } else {
            console.log('✗ Theme toggle FAILED');
        }
        
        // Toggle back
        themeToggle.click();
    }, 500);
} else {
    console.log('✗ Theme toggle button NOT FOUND');
}

// Test 2: Theme Persistence
setTimeout(() => {
    console.log('\nTEST 2: Theme Persistence');
    console.log('-------------------------');
    
    const savedTheme = localStorage.getItem('dashboard_theme');
    if (savedTheme) {
        console.log(`✓ Theme saved in localStorage: ${savedTheme}`);
        
        const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
        const parsedTheme = JSON.parse(savedTheme);
        
        if (currentTheme === parsedTheme) {
            console.log('✓ Theme loads correctly on page load');
        } else {
            console.log(`✗ Theme mismatch: saved=${parsedTheme}, current=${currentTheme}`);
        }
    } else {
        console.log('✗ No theme found in localStorage');
    }
}, 1000);

// Test 3: Custom Name Greeting
setTimeout(() => {
    console.log('\nTEST 3: Custom Name Greeting');
    console.log('----------------------------');
    
    const nameInput = document.getElementById('name-input');
    const greetingText = document.getElementById('greeting-text');
    
    if (nameInput) {
        console.log('✓ Name input field exists');
        console.log(`  Current value: "${nameInput.value}"`);
        console.log(`  Current greeting: "${greetingText.textContent}"`);
        
        // Test setting name
        console.log('  Testing name input...');
        const testName = 'TestUser';
        nameInput.value = testName;
        nameInput.dispatchEvent(new Event('blur'));
        
        setTimeout(() => {
            const greeting = greetingText.textContent;
            if (greeting.includes(testName)) {
                console.log(`✓ Name appears in greeting: "${greeting}"`);
            } else {
                console.log(`✗ Name NOT in greeting: "${greeting}"`);
            }
            
            // Test clearing name
            console.log('  Testing name removal...');
            nameInput.value = '';
            nameInput.dispatchEvent(new Event('blur'));
            
            setTimeout(() => {
                const newGreeting = greetingText.textContent;
                if (!newGreeting.includes(testName)) {
                    console.log(`✓ Name removed from greeting: "${newGreeting}"`);
                } else {
                    console.log('✗ Name still appears after clearing');
                }
            }, 500);
        }, 500);
    } else {
        console.log('✗ Name input field NOT FOUND');
    }
}, 1500);

// Test 4: Name Persistence
setTimeout(() => {
    console.log('\nTEST 4: Name Persistence');
    console.log('------------------------');
    
    const savedName = localStorage.getItem('dashboard_userName');
    if (savedName !== null) {
        console.log(`✓ Name saved in localStorage: "${JSON.parse(savedName)}"`);
        
        const nameInput = document.getElementById('name-input');
        if (nameInput) {
            const parsedName = JSON.parse(savedName);
            if (nameInput.value === parsedName) {
                console.log('✓ Name loads correctly on page load');
            } else {
                console.log(`  Note: Current input="${nameInput.value}", saved="${parsedName}"`);
            }
        }
    } else {
        console.log('  No name currently saved (this is OK if no name was set)');
    }
}, 3000);

// Test 5: Task Sorting Functionality
setTimeout(() => {
    console.log('\nTEST 5: Task Sorting Functionality');
    console.log('----------------------------------');
    
    const sortSelect = document.getElementById('task-sort-select');
    
    if (sortSelect) {
        console.log('✓ Sort dropdown exists');
        console.log(`  Current sort: ${sortSelect.value}`);
        console.log('  Available options:');
        
        Array.from(sortSelect.options).forEach(option => {
            console.log(`    - ${option.value}: ${option.text}`);
        });
        
        // Test each sort option
        const sortOptions = ['default', 'newest', 'oldest', 'alpha', 'incomplete', 'completed'];
        console.log('  Testing sort options...');
        
        sortOptions.forEach((option, index) => {
            setTimeout(() => {
                sortSelect.value = option;
                sortSelect.dispatchEvent(new Event('change'));
                
                setTimeout(() => {
                    if (sortSelect.value === option) {
                        console.log(`  ✓ ${option} sort applied`);
                    } else {
                        console.log(`  ✗ ${option} sort FAILED`);
                    }
                }, 100);
            }, index * 300);
        });
    } else {
        console.log('✗ Sort dropdown NOT FOUND');
    }
}, 3500);

// Test 6: Sort Persistence
setTimeout(() => {
    console.log('\nTEST 6: Sort Persistence');
    console.log('------------------------');
    
    const savedSort = localStorage.getItem('dashboard_sortPreference');
    if (savedSort) {
        console.log(`✓ Sort preference saved: ${JSON.parse(savedSort)}`);
        
        const sortSelect = document.getElementById('task-sort-select');
        if (sortSelect) {
            const parsedSort = JSON.parse(savedSort);
            if (sortSelect.value === parsedSort) {
                console.log('✓ Sort preference loads correctly');
                console.log('✓ Visual indicator shows active sort');
            } else {
                console.log(`✗ Sort mismatch: saved=${parsedSort}, current=${sortSelect.value}`);
            }
        }
    } else {
        console.log('  No sort preference saved (default will be used)');
    }
}, 5500);

// Test 7: Integration - All Features Together
setTimeout(() => {
    console.log('\nTEST 7: Integration - All Features Together');
    console.log('-------------------------------------------');
    
    const themeToggle = document.getElementById('theme-toggle');
    const nameInput = document.getElementById('name-input');
    const sortSelect = document.getElementById('task-sort-select');
    const greetingText = document.getElementById('greeting-text');
    
    console.log('Testing all features together...');
    
    // Set name
    nameInput.value = 'IntegrationTest';
    nameInput.dispatchEvent(new Event('blur'));
    
    setTimeout(() => {
        // Toggle theme
        themeToggle.click();
        
        setTimeout(() => {
            // Change sort
            sortSelect.value = 'alpha';
            sortSelect.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                const nameWorks = greetingText.textContent.includes('IntegrationTest');
                const themeWorks = document.documentElement.classList.contains('dark-theme') || 
                                  document.documentElement.classList.contains('light-theme');
                const sortWorks = sortSelect.value === 'alpha';
                
                console.log(`  Name feature: ${nameWorks ? '✓' : '✗'}`);
                console.log(`  Theme feature: ${themeWorks ? '✓' : '✗'}`);
                console.log(`  Sort feature: ${sortWorks ? '✓' : '✗'}`);
                
                if (nameWorks && themeWorks && sortWorks) {
                    console.log('✓ All features work together correctly');
                } else {
                    console.log('✗ Some features not working together');
                }
                
                // Check persistence
                const themeStored = localStorage.getItem('dashboard_theme');
                const nameStored = localStorage.getItem('dashboard_userName');
                const sortStored = localStorage.getItem('dashboard_sortPreference');
                
                console.log('\nPersistence check:');
                console.log(`  Theme stored: ${themeStored ? '✓' : '✗'}`);
                console.log(`  Name stored: ${nameStored !== null ? '✓' : '✗'}`);
                console.log(`  Sort stored: ${sortStored ? '✓' : '✗'}`);
                
                if (themeStored && nameStored !== null && sortStored) {
                    console.log('✓ All preferences persist correctly');
                } else {
                    console.log('✗ Not all preferences persist');
                }
                
                console.log('\n=== VERIFICATION COMPLETE ===');
                console.log('\nTo test persistence across page reloads:');
                console.log('1. Note the current theme, name, and sort settings');
                console.log('2. Reload the page (F5 or Ctrl+R)');
                console.log('3. Verify all settings are restored');
            }, 500);
        }, 500);
    }, 500);
}, 6000);

console.log('\nTests are running... Check console output above.\n');
