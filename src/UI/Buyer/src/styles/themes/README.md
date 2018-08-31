# Theme

We've split up theme into four files to start:

- override-bootstrap-variables: include any overrides to bootstrap variables here
- custom-variables: include custom created variables here
- default: include rules for styles that might be shared across multiple themes
- theme: include rules for your theme

Take a look at main.scss to see the order in which these files are pulled in. You'll notice variables come before vendor files - this is necessary so our overrides take effect. Then at the very end styles for our theme are added. This ensures that our themes styles take precedence over any default styles
