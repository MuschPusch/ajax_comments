INSTALLATION

1. Unpack module to your sites/all/modules directory
2. Enable "AJAX comments" module at Administer -> Site building -> Modules (admin/build/modules)

TROUBLESHOOTING

1. If you made all of those installation steps and comments are still not AJAXed, make sure that
"Location of comment submission form" option in comment settings of your module is set to
"Display below post or comments".

2. If you have themed your comments output, make sure that everything is wrapped to ".comment" class
in your "comment.tpl.php"

3. Drupal 5 version of AJAX comments MODULE WILL NOT WORK WITH CAPTCHA setting other than
"Don't place captcha if passed previously"


Created by Alexandr Shvets, aka neochief
http://drupaldance.com/