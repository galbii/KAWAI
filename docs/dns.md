# kawaius.com DNS Records

## Zone Records

```
kawaius.com.     3600     IN     SOA         ns1.metrosolutions.net. misogusic.gmail.com. 2026031001 3600 1800 1209600 86400
kawaius.com.     3600     IN     NS          ns2.metrosolutions.net.
kawaius.com.     3600     IN     NS          ns1.metrosolutions.net.
kawaius.com.     600      IN     A           104.245.247.82
kawaius.com.     600      IN     TXT         "v=spf1 ip4:104.245.247.82 +a +mx +ip4:40.74.104.0/27 +ip4:210.138.128.32/27 +include:spf.protection.outlook.com +include:spf.ess.barracudanetworks.com ~all"
kawaius.com.     600      IN     MX     10   d95495a.ess.barracudanetworks.com.
kawaius.com.     600      IN     MX     20   d95495b.ess.barracudanetworks.com.
_dmarc.kawaius.com.     235     IN     TXT   "v=DMARC1;p=quarantine;sp=none;adkim=r;aspf=r;pct=100;fo=1;rf=afrf;ri=86400;rua=mailto:rua+kawaius.com@dmarc.barracudanetworks.com;ruf=mailto:ruf+kawaius.com@dmarc.barracudanetworks.com"
```

## Summary

| Type | Name | Value | TTL |
|------|------|-------|-----|
| SOA | kawaius.com | ns1.metrosolutions.net. (serial: 2026031001) | 3600 |
| NS | kawaius.com | ns1.metrosolutions.net. | 3600 |
| NS | kawaius.com | ns2.metrosolutions.net. | 3600 |
| A | kawaius.com | 104.245.247.82 | 600 |
| MX 10 | kawaius.com | d95495a.ess.barracudanetworks.com. | 600 |
| MX 20 | kawaius.com | d95495b.ess.barracudanetworks.com. | 600 |
| TXT (SPF) | kawaius.com | v=spf1 ip4:104.245.247.82 ... ~all | 600 |
| TXT (DMARC) | _dmarc.kawaius.com | v=DMARC1; p=quarantine ... | 235 |

## Notes

- **Nameservers**: MetroSolutions (ns1/ns2.metrosolutions.net)
- **Hosting IP**: 104.245.247.82
- **Email filtering**: Barracuda ESS (MX + SPF + DMARC)
- **DMARC policy**: quarantine, 100% coverage, reports to Barracuda
- **SPF includes**: Office 365 + Barracuda ESS
