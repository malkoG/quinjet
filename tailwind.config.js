/** @type {import('tailwindcss').Config} **/
import withMT from "@material-tailwind/html/utils/withMT";

export default withMT({
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
})

