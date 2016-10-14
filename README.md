# mylol
my league of legend site

# setup

httpd-vhosts.conf

<VirtualHost *:80>
    DocumentRoot "D:/xampp5612/htdocs/personal/mylol/html"
    ServerName mylol.local
    <Directory "D:/xampp5612/htdocs/personal/mylol/html">
      #Order allow,deny
      #Allow from all
      Require all granted
    </Directory>
</VirtualHost>
