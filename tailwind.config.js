/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // We can add specific named colors if we want to change 'green-900' to exact #006400 globally,
                // but for now, standard palette is sufficient and matches the code written.
            },
        },
    },
    plugins: [],
}
