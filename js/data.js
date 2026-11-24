/* =========================================================
   CONTEÚDO DO PORTFÓLIO — edite aqui sem mexer no layout.
   Campos vazios ('') são ocultados automaticamente.
   ========================================================= */
window.PORTFOLIO = {
  profile: {
    name: 'Kauany Kamily',
    roles: ['Software Developer', 'Systems Analyst', 'Automation & Technology'],
    location: 'Várzea Grande – MT, Brasil',
    github: 'https://github.com/kauanykamily18-dev',
    linkedin: '',            // ex.: 'https://www.linkedin.com/in/seu-perfil'
    behance: 'https://www.behance.net/kauanykamily',
    email: 'kauanykamily18@gmail.com',
    cv: 'assets/curriculo.pdf', // o botão só aparece se este arquivo existir
  },

  focus: ['Sistemas web', 'Automação de processos', 'APIs & integrações', 'Banco de dados', 'UI/UX', 'Infraestrutura & deploy'],

  experience: [
    {
      company: 'Bioma Soluções',
      role: 'Tecnologia da Informação',
      tag: 'Desenvolvimento de sistemas',
      summary: 'Participação no desenvolvimento, manutenção e evolução de sistemas utilizados em processos empresariais.',
      points: ['Desenvolvimento e manutenção de sistemas', 'Automação de processos', 'Integração de serviços', 'Monitoramento de informações', 'Soluções tecnológicas para processos ambientais e administrativos'],
      systems: ['Radar Bioma', 'Sistema Financeiro Bioma', 'Diário Oficial Bioma', 'Sistema de Termos', 'Monitoramento APF'],
    },
    {
      company: 'Ominy Desenvolvimentos',
      role: 'Cofundadora · Desenvolvedora de Sistemas',
      tag: 'Empresa própria',
      summary: 'Empresa de tecnologia fundada por mim e meu sócio, voltada ao desenvolvimento de soluções digitais e sistemas personalizados.',
      points: ['Sistemas web', 'Aplicações empresariais', 'Sistemas financeiros', 'Integrações e automações', 'Landing pages e sites', 'Banco de dados e infraestrutura', 'Prototipação e experiência do usuário'],
      link: { label: 'ominydesenvolvimentos.com', href: 'https://ominydesenvolvimentos.com' },
    },
    {
      company: 'DAE-VG',
      role: 'Analista de Sistemas · Desenvolvedora Web',
      tag: 'PJ · Departamento de Água e Esgoto',
      summary: 'Atuação como profissional PJ no desenvolvimento web e na análise de sistemas do Departamento de Água e Esgoto de Várzea Grande.',
      points: ['Desenvolvimento de páginas do site institucional', 'Desenvolvimento de telas e interfaces', 'Suporte no fluxo de informações', 'Implementação de melhorias e correções'],
      link: { label: 'daevg.com.br/transparencia', href: 'https://daevg.com.br/transparencia' },
    },
    {
      company: 'Irmãos Domingos LTDA',
      role: 'Jovem Aprendiz — TI',
      tag: 'Suporte e sistemas corporativos',
      summary: 'Atendimento e suporte presencial a usuários, com foco nos sistemas corporativos da empresa.',
      points: ['Design e UI/UX completos do site da Casa Domingos', 'Suporte a ERP TOTVS (WinThor e WMS) e CRM', 'Cadastro de produtos, clientes e usuários', 'Suporte a impressoras, rede básica e VPN'],
      link: { label: 'casadomingos.com.br', href: 'https://www.casadomingos.com.br/' },
    },
    {
      company: 'APVS Brasil Proteção Veicular',
      role: 'Marketing Digital / Social',
      tag: '2024 · 8 meses',
      summary: 'Apoio ao funil de vendas com automação comercial, integrações e criação de sites.',
      points: ['Integrações entre CRM, WhatsApp, sites e sistemas internos', 'Fluxos de automação com n8n, Make e Zapier', 'Criação e manutenção de sites institucionais, landing pages e sistemas', 'Apoio a funil de vendas e automação comercial'],
    },
  ],

  /* ícones: 'd:pasta/arquivo' = devicon (colorido) · 's:nome:#cor' = simple-icons · sem ícone = tag de texto */
  stack: [
    { title: 'Linguagens', desc: 'A base do dia a dia — do script de automação à interface.',
      items: [['Python', 'd:python/python-original'], ['JavaScript', 'd:javascript/javascript-original'], ['HTML5', 'd:html5/html5-original'], ['CSS3', 'd:css3/css3-original'], ['Java', 'd:java/java-original'], ['SQL', 'd:azuresqldatabase/azuresqldatabase-original']] },
    { title: 'Backend', desc: 'Regras de negócio, APIs e a arquitetura que sustenta cada sistema.',
      items: [['Flask', 'd:flask/flask-original'], ['Node.js', 'd:nodejs/nodejs-original'], ['APIs REST'], ['Integração de APIs'], ['Webhooks'], ['Sistemas web'], ['Arquitetura de aplicações']] },
    { title: 'Banco de dados', desc: 'Modelagem e persistência, do relacional ao tempo real.',
      items: [['PostgreSQL', 'd:postgresql/postgresql-original'], ['SQLite', 'd:sqlite/sqlite-original'], ['Firebase', 'd:firebase/firebase-original'], ['Firestore', 'd:firebase/firebase-plain']] },
    { title: 'Frontend & interfaces', desc: 'Interfaces responsivas, pensadas a partir de quem vai usar.',
      items: [['HTML', 'd:html5/html5-original'], ['CSS', 'd:css3/css3-original'], ['JavaScript', 'd:javascript/javascript-original'], ['Figma', 'd:figma/figma-original'], ['Elementor', 's:elementor:#92003B'], ['Design responsivo'], ['UI/UX Design'], ['Prototipação']] },
    { title: 'Automação & infra', desc: 'Robôs, integrações e o caminho do código até o servidor.',
      items: [['Playwright', 'd:playwright/playwright-original'], ['n8n', 's:n8n:#EA4B71'], ['Make', 's:make:#6D00CC'], ['Zapier', 's:zapier:#FF4F00'], ['Docker', 'd:docker/docker-original'], ['Git', 'd:git/git-original'], ['GitHub', 'd:github/github-original'], ['Linux', 'd:linux/linux-original'], ['Ubuntu', 'd:ubuntu/ubuntu-original'], ['Nginx', 'd:nginx/nginx-original'], ['Automação de processos'], ['Bots e integrações'], ['Integrações CRM ↔ WhatsApp'], ['VPS'], ['Deploy e gerenciamento de aplicações']] },
    { title: 'Sistemas corporativos', desc: 'ERP, CRM e o suporte que mantém a operação funcionando.',
      items: [['ERP TOTVS — WinThor e WMS', 's:totvs:#1F2328'], ['CRM'], ['Suporte a sistemas e usuários'], ['Análise de dados e relatórios'], ['Dashboards'], ['Noções de LGPD']] },
    { title: 'Design & criatividade', desc: 'Identidade visual e protótipos que dão forma ao produto.',
      items: [['Figma', 'd:figma/figma-original'], ['Canva', 'd:canva/canva-original'], ['Adobe', 's:adobe:#FF0000'], ['CapCut'], ['Criação de interfaces'], ['Identidade visual'], ['Prototipação de produtos digitais']] },
  ],

  projects: [
    {
      id: 'diogo', name: 'Dr. Diogo Fernandes', accent: '#D4AF6A',
      kind: 'Site institucional · Advocacia',
      tagline: 'Site do advogado Diogo Fernandes, com atuação em Direito Ambiental, Agronegócio, Administrativo e Contratual.',
      badge: 'Projeto Ominy',
      shot: 'assets/projects/site-diogo.webp',
      problem: 'Um escritório de advocacia precisa transmitir credibilidade e confiança antes mesmo do primeiro contato com o cliente.',
      solution: 'Um site institucional com identidade sóbria, apresentação da trajetória, áreas de atuação, artigos e canais de atendimento integrados.',
      role: 'Projeto da Ominy Desenvolvimentos: design de interface e desenvolvimento web.',
      features: ['Apresentação da trajetória do advogado ("Quem sou")', 'Áreas de atuação: Ambiental, Agronegócio, Administrativo e Contratual', 'Seção de artigos', 'Agendamento de atendimento e canais de contato integrados', 'Layout moderno e 100% responsivo'],
      stack: ['UI/UX', 'Site institucional', 'Web responsiva'],
      links: [{ label: 'Visitar site', href: 'https://diogofernandes.com/' }, { label: 'Ver no Instagram', href: 'https://www.instagram.com/p/DZVpa2KD33Z/' }],
    },
    {
      id: 'jg', name: 'JG Stores', accent: '#E6E6E6',
      kind: 'E-commerce · Moda masculina',
      tagline: 'Loja virtual de roupas masculinas com catálogo, carrinho, pedidos pelo WhatsApp e painel do vendedor.',
      badge: 'E-commerce',
      shot: 'assets/projects/site-jg.webp',
      problem: 'Uma loja de roupas masculinas precisava de uma vitrine online e de um jeito simples de controlar estoque e vendas.',
      solution: 'Uma loja virtual com catálogo por categorias e tamanhos, carrinho com pedido direto pelo WhatsApp e um painel administrativo para o vendedor.',
      role: 'Design e desenvolvimento da loja e do painel administrativo.',
      features: ['Vitrine com banners e categorias (camisetas, ofertas)', 'Filtro de produtos por tamanho', 'Carrinho com finalização do pedido pelo WhatsApp', 'Painel do vendedor com acesso restrito', 'Resumo financeiro e alerta de estoque baixo', 'Cadastro de produtos, entrada de mercadoria e venda manual', 'Histórico de movimentações'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Supabase', 'Vercel'],
      links: [{ label: 'Visitar loja', href: 'https://jegstores.vercel.app/' }],
    },
    {
      id: 'mika', name: 'Mika em MT 2026', accent: '#E5383B',
      kind: 'Projeto social · Plataforma web',
      tagline: 'Site do projeto beneficente que une tatuagem, eventos, esporte e arrecadação de alimentos.',
      badge: 'Projeto social',
      shot: 'assets/projects/site-mika.webp',
      problem: 'O projeto precisava divulgar suas ações e arrecadar recursos de forma organizada, com rifa, loja e eventos em um só lugar.',
      solution: 'Uma plataforma com rifa online e reserva de números compartilhada, loja de camisas, agenda de eventos, galeria de tatuagens e painel administrativo.',
      role: 'Desenvolvimento do site, da API e do painel administrativo.',
      features: ['Rifa online: escolha de números ou seleção aleatória', 'Reserva de números compartilhada entre os visitantes', 'Painel administrativo com login e gestão de pedidos', 'Loja de camisas com carrinho', 'Eventos, arrecadações e galeria de tatuagens', 'API em Node.js com banco PostgreSQL'],
      stack: ['Node.js', 'Express', 'PostgreSQL', 'Supabase', 'JavaScript', 'Vercel'],
      links: [{ label: 'Visitar site', href: 'https://mikaemmt.vercel.app/' }, { label: 'Vídeo do projeto', href: 'https://www.instagram.com/reel/DcMvy-IpH9a/' }],
    },
  ],

  /* Galeria "Sistemas desenvolvidos para a Bioma" (seção Projetos) */
  biomaSystems: [
    { name: 'Radar Bioma', type: 'Monitoramento', img: 'assets/projects/bioma-radar.webp', w: 720, h: 320,
      summary: 'Plataforma de monitoramento ambiental integrada ao SIMCAR/SEMA-MT. Automatiza consultas de CAR, acompanha alterações de situação e movimentações de processos, monitora o andamento do PRA e envia alertas pelo Telegram. Também oferece histórico, auditoria, relatórios e gerenciamento de propriedades.' },
    { name: 'Sistema Financeiro', type: 'Sistema', img: 'assets/projects/bioma-financeiro.webp', w: 720, h: 320,
      summary: 'Sistema de gestão financeira desenvolvido para centralizar o controle de movimentações e informações financeiras, com painel administrativo e visualização de indicadores. Facilita o acompanhamento da situação financeira e a organização das operações.' },
    { name: 'Diário Oficial', type: 'Monitoramento', img: 'assets/projects/bioma-diario-oficial.webp', w: 714, h: 320,
      summary: 'Plataforma de monitoramento e pesquisa de publicações oficiais, com identificação de nomes e acompanhamento de informações jurídicas. O projeto também contempla integrações com DataJud e serviços do PJe para consulta de processos e movimentações judiciais, com expansão para diferentes tribunais e estados.' },
    { name: 'Monitoramento APF', type: 'Monitoramento', img: 'assets/projects/bioma-apf.webp', w: 715, h: 320,
      summary: 'Sistema de acompanhamento automatizado de Autorizações Provisórias de Funcionamento (APF). Monitora propriedades e alterações de situação junto à SEMA, identifica emissões e cancelamentos e envia notificações automáticas pelo Telegram para manter a equipe informada.' },
    { name: 'Sistema de Termos', type: 'Sistema de alertas', img: 'assets/projects/bioma-termos.webp', w: 718, h: 320,
      summary: 'Plataforma de acompanhamento e monitoramento de termos, com painel de indicadores e visualização de informações para facilitar o controle e a identificação de situações que exigem atenção.' },
  ],

  /* Ominy no Instagram (seção Projetos) — imagens salvas em assets/ominy */
  ominyInstagram: {
    handle: 'ominydev',
    name: 'Ominy Desenvolvimentos',
    url: 'https://www.instagram.com/ominydev/',
    avatar: 'assets/ominy/avatar.webp',
    bio: 'Sistemas, aplicativos, sites e landing pages sob medida.',
    posts: [
      { type: 'post', url: 'https://www.instagram.com/p/DZVpa2KD33Z/', img: 'assets/ominy/post-site-juridico.webp', title: 'Site jurídico — Dr. Diogo Fernandes', caption: 'Presença digital estratégica, rápida e 100% responsiva.' },
      { type: 'post', url: 'https://www.instagram.com/p/DZDWqtykf5o/', img: 'assets/ominy/post-sistemas-sob-medida.webp', title: 'Sistema Financeiro', caption: 'Sistemas e aplicativos sob medida para automatizar rotinas.' },
      { type: 'reel', url: 'https://www.instagram.com/reel/DZNcppJBcPw/', img: 'assets/ominy/reel-ominy.webp', title: 'Sites, sistemas e landing pages', caption: 'Soluções digitais com foco em desempenho e identidade visual.' },
    ],
  },

  more: [
    { name: 'Dr. Tiago Campos', type: 'Site institucional · Figma → HTML', site: 'https://drtiagocampos.vercel.app', repo: 'https://github.com/kauanykamily18-dev/Dr.TiagoCampos' },
    { name: 'Embalagem Certa', type: 'Site institucional · Figma → HTML', site: 'https://embalagemcerta.vercel.app', repo: 'https://github.com/kauanykamily18-dev/embalagem.certa' },
    { name: 'Green Sabores Naturais', type: 'Site institucional · Figma → HTML', site: 'https://greensaboresnaturais.vercel.app', repo: 'https://github.com/kauanykamily18-dev/Green-Sabores-Naturais' },
    { name: 'Página de links Ominy', type: 'Link na bio', site: 'https://ominydesenvolvimentos.vercel.app', repo: 'https://github.com/kauanykamily18-dev/pagina-de-links-ominy' },
    { name: 'Zynn — Telemedicina', type: 'Projeto acadêmico UNIC · HTML & CSS', site: '', repo: 'https://github.com/kauanykamily18-dev/Zynn---Plataforma-de-Telemedicina' },
    { name: 'One Piece Web Design', type: 'Frontend a partir do Figma · HTML, CSS e JS', site: '', repo: 'https://github.com/kauanykamily18-dev/One-piece-website' },
  ],

  education: [
    { course: 'Análise e Desenvolvimento de Sistemas', institution: 'UNIC Pantanal', detail: '4º semestre · previsão de conclusão em 2027', status: 'Em andamento' },
    { course: 'Engenharia de Software', institution: 'Uninter', detail: '1º semestre', status: 'Em andamento' },
  ],

  certifications: [
    { name: 'Fundamentos de Programação — HTML, CSS, JavaScript e Lógica de Programação', org: 'Gustavo Guanabara' },
    { name: 'Crie Seu Usuário — HTML, CSS e JavaScript', org: 'Fundação Bradesco' },
    { name: 'Assistente Administrativo com Informática', org: 'SENAI · 120h' },
    { name: 'Assistente de Recursos Humanos', org: 'SENAI · 160h' },
  ],

  /* TECLADO 3D — 24 teclas (6 colunas × 4 linhas), na ordem em que aparecem.
     Teclas físicas: linha 1 = 1–6 · linha 2 = Q–Y · linha 3 = A–H · linha 4 = Z–N
     icon: 's:nome' = simple-icons · 'd:pasta/arquivo' = devicon colorido · 't:TEXTO' = texto na tecla */
  keyboard: [
    { name: 'Python', icon: 's:python', color: '#3776AB', desc: 'Linguagem principal das automações, backends e scripts.' },
    { name: 'JavaScript', icon: 's:javascript', color: '#F7DF1E', desc: 'Interatividade no front e lógica no back com Node.js.' },
    { name: 'HTML5', icon: 's:html5', color: '#E34F26', desc: 'Estrutura semântica e acessível das interfaces.' },
    { name: 'CSS3', icon: 's:css3', color: '#1572B6', desc: 'Layouts responsivos, animações e identidade visual.' },
    { name: 'Java', icon: 's:openjdk', color: '#ED8B00', desc: 'Orientação a objetos e fundamentos de engenharia.' },
    { name: 'SQL', icon: 't:SQL', color: '#7C5CFF', desc: 'Consultas, modelagem e regras direto no banco.' },
    { name: 'Flask', icon: 's:flask', color: '#1D1D20', desc: 'Backends e APIs dos sistemas, como o Radar Bioma.' },
    { name: 'Node.js', icon: 's:nodedotjs', color: '#5FA04E', desc: 'Serviços, integrações e APIs em JavaScript.' },
    { name: 'APIs REST', icon: 't:API', color: '#33D6E6', desc: 'Integração entre sistemas, serviços e webhooks.' },
    { name: 'PostgreSQL', icon: 's:postgresql', color: '#4169E1', desc: 'Banco relacional para sistemas empresariais.' },
    { name: 'SQLite', icon: 's:sqlite', color: '#0F80CC', desc: 'Persistência leve e eficiente para aplicações.' },
    { name: 'Firebase', icon: 's:firebase', color: '#FFCA28', desc: 'Autenticação, Firestore e dados em tempo real.' },
    { name: 'Playwright', icon: 'd:playwright/playwright-original', color: '#2D4552', desc: 'Automação web: consultas e monitoramentos sem trabalho manual.' },
    { name: 'Docker', icon: 's:docker', color: '#2496ED', desc: 'Aplicações em containers, do desenvolvimento ao deploy.' },
    { name: 'Git', icon: 's:git', color: '#F05032', desc: 'Versionamento e histórico de cada projeto.' },
    { name: 'GitHub', icon: 's:github', color: '#24292F', desc: 'Repositórios, colaboração e código publicado.' },
    { name: 'Linux', icon: 's:linux', color: '#FCC624', desc: 'Servidores e ambiente de deploy.' },
    { name: 'Ubuntu', icon: 's:ubuntu', color: '#E95420', desc: 'Servidores Ubuntu para hospedar aplicações em VPS.' },
    { name: 'Nginx', icon: 's:nginx', color: '#009639', desc: 'Proxy reverso e publicação das aplicações.' },
    { name: 'Telegram', icon: 's:telegram', color: '#26A5E4', desc: 'Bots e notificações automáticas, como os alertas do Radar Bioma.' },
    { name: 'Figma', icon: 's:figma', color: '#F24E1E', desc: 'Prototipação de interfaces e produtos digitais.' },
    { name: 'Elementor', icon: 's:elementor', color: '#92003B', desc: 'Sites e landing pages com WordPress.' },
    { name: 'Canva', icon: 's:canva', color: '#00C4CC', desc: 'Peças visuais e identidade de marca.' },
    { name: 'Adobe', icon: 's:adobe', color: '#FA0F00', desc: 'Edição e criação de materiais visuais.' },
  ],
};
