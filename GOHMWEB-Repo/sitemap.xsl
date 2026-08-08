<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <html>
            <head>
                <title>GreatOhm — Sitemap</title>
                <meta charset="UTF-8"/>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 40px 20px; color: #1a1a2e; }
                    .container { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 40px; }
                    h1 { font-size: 28px; margin: 0 0 8px; color: #0f766e; }
                    p.sub { color: #6b7280; margin: 0 0 30px; font-size: 14px; }
                    table { width: 100%; border-collapse: collapse; }
                    th { text-align: left; padding: 12px 14px; background: #0f766e; color: #fff; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
                    td { padding: 12px 14px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
                    tr:hover td { background: #f0fdfa; }
                    a { color: #0f766e; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
                    .high { background: #dcfce7; color: #166534; }
                    .med { background: #fef9c3; color: #854d0e; }
                    .low { background: #fee2e2; color: #991b1b; }
                    .footer { margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>GreatOhm Sitemap</h1>
                    <p class="sub">XML sitemap for search engines — <xsl:value-of select="count(//sitemap:url)"/> URLs listed</p>
                    <table>
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Last Modified</th>
                                <th>Frequency</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="//sitemap:url">
                                <tr>
                                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                                    <td><xsl:value-of select="sitemap:changefreq"/></td>
                                    <td>
                                        <xsl:choose>
                                            <xsl:when test="sitemap:priority >= 0.8">
                                                <span class="badge high"><xsl:value-of select="sitemap:priority"/></span>
                                            </xsl:when>
                                            <xsl:when test="sitemap:priority >= 0.5">
                                                <span class="badge med"><xsl:value-of select="sitemap:priority"/></span>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <span class="badge low"><xsl:value-of select="sitemap:priority"/></span>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                    <div class="footer">© 2026 GreatOhm. All rights reserved.</div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>