import { SuggestedQuestion } from '../types';

// Predefined answers to suggested questions
export const answers: Record<string, { en: string; id: string }> = {
  'website-pricing': {
    en: 'Our website development services start from $3 for a simple landing page to $120+ for complex web applications. Each project is quoted based on specific requirements, complexity, and timeline. We offer flexible payment plans to accommodate your budget. For a detailed quote, please share more about your project requirements.',
    id: 'Layanan pengembangan website kami dimulai dari Rp50.000 aja untuk landing page sederhana hingga Rp2 juta+ untuk aplikasi web yang kompleks. Setiap proyek dihargai berdasarkan persyaratan, kompleksitas, dan timeline tertentu. Kami menawarkan paket pembayaran yang fleksibel untuk mengakomodasi anggaran Anda. Untuk penawaran yang lebih detail, silakan bagikan lebih banyak tentang kebutuhan proyek Anda.'
  },
  'website-timeline': {
    en: 'Website development timelines vary based on complexity. Simple websites take 2-4 weeks, medium-sized projects 1-2 months, and complex platforms 3+ months. Our team works efficiently to meet your deadlines while ensuring quality. We provide a detailed timeline during the initial consultation after understanding your specific requirements.',
    id: 'Timeline pengembangan website bervariasi berdasarkan kompleksitasnya. Website sederhana membutuhkan waktu 2-4 minggu, proyek berukuran sedang 1-2 bulan, dan platform kompleks 3+ bulan. Tim kami bekerja secara efisien untuk memenuhi tenggat waktu Anda sambil memastikan kualitas. Kami memberikan timeline terperinci selama konsultasi awal setelah memahami persyaratan spesifik Anda.'
  },
  'website-technologies': {
    en: 'We use modern technologies for website development including React, Vue, Angular for frontend, and Node.js, Django, Laravel for backend. For e-commerce, we utilize platforms like WooCommerce and Shopify. Our stack selection depends on your specific requirements to ensure optimal performance, scalability, and maintainability.',
    id: 'Kami menggunakan teknologi modern untuk pengembangan website termasuk React, Vue, Angular untuk frontend, dan Node.js, Django, Laravel untuk backend. Untuk e-commerce, kami menggunakan platform seperti WooCommerce dan Shopify. Pemilihan stack kami bergantung pada persyaratan spesifik Anda untuk memastikan kinerja, skalabilitas, dan pemeliharaan yang optimal.'
  },
  'academy-courses': {
    en: 'Our coding academy offers comprehensive courses in Web Development (HTML, CSS, JavaScript), Mobile App Development (React Native, Flutter), Data Science (Python, R), and DevOps. Each course combines theoretical concepts with practical projects. We offer both beginner and advanced levels, with flexible scheduling options including full-time, part-time, and weekend classes.',
    id: 'Akademi coding kami menawarkan kursus komprehensif dalam Pengembangan Web (HTML, CSS, JavaScript), Pengembangan Aplikasi Seluler (React Native, Flutter), Data Science (Python, R), dan DevOps. Setiap kursus menggabungkan konsep teoritis dengan proyek praktis. Kami menawarkan tingkat pemula dan lanjutan, dengan opsi penjadwalan fleksibel termasuk kelas penuh waktu, paruh waktu, dan akhir pekan.'
  },
  'academy-pricing': {
    en: 'Our coding bootcamp tuition ranges from $1,000 for short courses to $5,000 for intensive bootcamps. We offer early-bird discounts, scholarships for underrepresented groups, and payment plans. The investment includes instruction, course materials, project assessments, career coaching, and certification. Contact us to discuss financial assistance options.',
    id: 'Biaya bootcamp coding kami berkisar dari Rp15 juta untuk kursus singkat hingga Rp75 juta untuk bootcamp intensif. Kami menawarkan diskon early-bird, beasiswa untuk kelompok yang kurang terwakili, dan paket pembayaran. Investasi ini mencakup instruksi, materi kursus, penilaian proyek, pelatihan karir, dan sertifikasi. Hubungi kami untuk mendiskusikan opsi bantuan keuangan.'
  },
  'academy-instructors': {
    en: 'Our instructors are industry professionals with 5+ years of experience in software development, data science, and cybersecurity. Many have worked at top tech companies and bring real-world expertise to the classroom. They undergo rigorous training in our teaching methodology and maintain current industry knowledge through ongoing professional development.',
    id: 'Instruktur kami adalah profesional industri dengan pengalaman 5+ tahun dalam pengembangan perangkat lunak, data science, dan keamanan siber. Banyak yang telah bekerja di perusahaan teknologi terkemuka dan membawa keahlian dunia nyata ke kelas. Mereka menjalani pelatihan ketat dalam metodologi pengajaran kami dan mempertahankan pengetahuan industri saat ini melalui pengembangan profesional berkelanjutan.'
  },
  'code-react-example': {
    en: 'Here\'s a React component example that implements a counter with Tailwind CSS styling:\n\n```import React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="p-4 bg-white rounded-lg shadow-md">\n      <h2 className="text-xl font-bold mb-2">Counter: {count}</h2>\n      <div className="flex gap-2">\n        <button \n          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"\n          onClick={() => setCount(count + 1)}\n        >\n          Increment\n        </button>\n        <button \n          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"\n          onClick={() => setCount(count - 1)}\n        >\n          Decrement\n        </button>\n      </div>\n    </div>\n  );\n}\n\nexport default Counter;',
    id: 'Berikut adalah contoh komponen React yang mengimplementasikan penghitung dengan styling Tailwind CSS:\n\n```import React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="p-4 bg-white rounded-lg shadow-md">\n      <h2 className="text-xl font-bold mb-2">Penghitung: {count}</h2>\n      <div className="flex gap-2">\n        <button \n          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"\n          onClick={() => setCount(count + 1)}\n        >\n          Tambah\n        </button>\n        <button \n          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"\n          onClick={() => setCount(count - 1)}\n        >\n          Kurang\n        </button>\n      </div>\n    </div>\n  );\n}\n\nexport default Counter;'
  },
  'code-html-example': {
    en: 'Here\'s an HTML example with Tailwind CSS styling:\n\n```<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Website</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-gray-100">\n  <div class="container mx-auto px-4 py-8">\n    <h1 class="text-3xl font-bold text-blue-600">Hello World</h1>\n    <p class="mt-2 text-gray-700">Welcome to my website</p>\n  </div>\n</body>\n</html>',
    id: 'Berikut adalah contoh HTML dengan styling Tailwind CSS:\n\n```<!DOCTYPE html>\n<html lang="id">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Website Saya</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-gray-100">\n  <div class="container mx-auto px-4 py-8">\n    <h1 class="text-3xl font-bold text-blue-600">Halo Dunia</h1>\n    <p class="mt-2 text-gray-700">Selamat datang di website saya</p>\n  </div>\n</body>\n</html>'
  }
};

// Suggested questions that will be displayed to users
export const suggestedQuestions: SuggestedQuestion[] = [
  {
    id: 'website-pricing',
    text: {
      en: 'How much does website development cost?',
      id: 'Berapa biaya pembuatan website?'
    },
    category: 'website'
  },
  {
    id: 'website-timeline',
    text: {
      en: 'How long does it take to develop a website?',
      id: 'Berapa lama waktu yang dibutuhkan untuk membuat website?'
    },
    category: 'website'
  },
  {
    id: 'website-technologies',
    text: {
      en: 'What technologies do you use for website development?',
      id: 'Teknologi apa yang digunakan untuk pengembangan website?'
    },
    category: 'website'
  },
  {
    id: 'code-react-example',
    text: {
      en: 'Show me a React component example',
      id: 'Tunjukkan contoh komponen React'
    },
    category: 'website'
  },
  {
    id: 'code-html-example',
    text: {
      en: 'Show me an HTML example with Tailwind',
      id: 'Tunjukkan contoh HTML dengan Tailwind'
    },
    category: 'website'
  },
  {
    id: 'academy-courses',
    text: {
      en: 'What courses are offered in your coding academy?',
      id: 'Kursus apa saja yang ditawarkan di akademi coding Anda?'
    },
    category: 'academy'
  },
  {
    id: 'academy-pricing',
    text: {
      en: 'How much does the coding bootcamp cost?',
      id: 'Berapa biaya bootcamp coding?'
    },
    category: 'academy'
  },
  {
    id: 'academy-instructors',
    text: {
      en: 'Who are the instructors at your coding academy?',
      id: 'Siapa instruktur di akademi coding Anda?'
    },
    category: 'academy'
  }
];

// Function to get predefined answer based on question ID and language
export const getAnswer = (questionId: string, language: 'en' | 'id'): string => {
  return answers[questionId]?.[language] || 
    (language === 'en' 
      ? "I don't have specific information on that topic yet. Please ask something about our website development services or coding academy."
      : "Saya belum memiliki informasi spesifik tentang topik tersebut. Silakan tanyakan sesuatu tentang layanan pengembangan website atau akademi coding kami.");
};

// Sample code snippets for demonstration
export const codeSnippets = {
  'html-example': {
    en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-blue-600">Hello World</h1>
    <p class="mt-2 text-gray-700">Welcome to my website</p>
  </div>
</body>
</html>`,
    id: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Saya</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-blue-600">Halo Dunia</h1>
    <p class="mt-2 text-gray-700">Selamat datang di website saya</p>
  </div>
</body>
</html>`
  },
  'javascript-example': {
    en: `// Simple JavaScript function to toggle dark mode
function toggleDarkMode() {
  const body = document.querySelector('body');
  const isDark = body.classList.contains('dark-mode');
  
  if (isDark) {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }
}

// Event listener
document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);`,
    id: `// Fungsi JavaScript sederhana untuk mengalihkan mode gelap
function toggleDarkMode() {
  const body = document.querySelector('body');
  const isDark = body.classList.contains('dark-mode');
  
  if (isDark) {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }
}

// Event listener
document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);`
  },
  'python-example': {
    en: `# Simple Flask API for a to-do list
from flask import Flask, request, jsonify

app = Flask(__name__)

todos = []

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    todo = {
        'id': len(todos) + 1,
        'title': data['title'],
        'completed': False
    }
    todos.append(todo)
    return jsonify(todo), 201

if __name__ == '__main__':
    app.run(debug=True)`,
    id: `# API Flask sederhana untuk daftar tugas
from flask import Flask, request, jsonify

app = Flask(__name__)

todos = []

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    todo = {
        'id': len(todos) + 1,
        'title': data['title'],
        'completed': False
    }
    todos.append(todo)
    return jsonify(todo), 201

if __name__ == '__main__':
    app.run(debug=True)`
  },
  'react-example': {
    en: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Counter: {count}</h2>
      <div className="flex gap-2">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}

export default Counter;`,
    id: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Penghitung: {count}</h2>
      <div className="flex gap-2">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setCount(count + 1)}
        >
          Tambah
        </button>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => setCount(count - 1)}
        >
          Kurang
        </button>
      </div>
    </div>
  );
}

export default Counter;`
  }
};

// List of code-related questions and programming examples
export const codeQuestions = [
  {
    keywords: ['html', 'website', 'page', 'struktur', 'halaman'],
    snippet: 'html-example',
    response: {
      en: 'Here\'s a simple HTML structure using Tailwind CSS for styling:',
      id: 'Berikut adalah struktur HTML sederhana menggunakan Tailwind CSS untuk styling:'
    }
  },
  {
    keywords: ['javascript', 'toggle', 'dark mode', 'theme', 'mode gelap', 'tema'],
    snippet: 'javascript-example',
    response: {
      en: 'Here\'s a JavaScript function to toggle between light and dark mode:',
      id: 'Berikut adalah fungsi JavaScript untuk beralih antara mode terang dan gelap:'
    }
  },
  {
    keywords: ['python', 'flask', 'api', 'backend', 'todo', 'tugas'],
    snippet: 'python-example',
    response: {
      en: 'Here\'s a simple Python Flask API for a to-do list application:',
      id: 'Berikut adalah API Flask Python sederhana untuk aplikasi daftar tugas:'
    }
  },
  {
    keywords: ['react', 'component', 'counter', 'komponen', 'penghitung'],
    snippet: 'react-example',
    response: {
      en: 'Here\'s a React component that implements a simple counter:',
      id: 'Berikut adalah komponen React yang mengimplementasikan penghitung sederhana:'
    }
  }
];