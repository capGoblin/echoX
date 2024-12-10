import { Github, Twitter, Linkedin } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/[0.1]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-muted-foreground mb-4 md:mb-0">
          © 2024 EchoX. All rights reserved.
        </div>
        <div className="flex space-x-6">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              className="text-muted-foreground hover:text-blue-400 transition-colors"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}