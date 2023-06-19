import { Instance, License } from '~/types'

const defaultLicense: License = {
  id: 9,
  instance: Instance.En,
  default: true,
  title: 'This content is licensed under CC BY-SA 4.0',
  shortTitle: 'CC BY-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-sa/4.0/',
  content: '[[{"col":24,"content":"siehe de.serlo"}]]',
  agreement:
    'By saving this page, you confirm that your contribution (including any edits you have made) is your own work, and that it does not infringe on the rights of third parties. You consent to publishing your contribution under the <a href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution/Share-Alike License 4.0</a> and/or under an equivalent license chosen by the Serlo Education e.V. in accordance with the regulations laid out in the <a href="https://en.serlo.org/terms">terms of use</a>. Should the contribution not be your own work, it must be available in accordance with the <a href="https://en.serlo.org/terms">terms of use</a>, and you must agree to comply with any necessary license requests.',
}

export const licenses = <License[]>[
  {
    id: 1,
    instance: Instance.De,
    default: true,
    title: 'Dieses Werk steht unter der freien Lizenz CC BY-SA 4.0.',
    shortTitle: 'CC BY-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/deed.de',
    content:
      '[[{"col":24,"content":"**Sie dürfen** das Lernmaterial beliebig **kopieren, vervielfältigen, bearbeiten** und darauf aufbauen - und zwar für beliebige Zwecke, sogar kommerziell. Dies gilt unter folgenden Bedingungen:\\n\\n### Wenn Sie **keine Veränderungen** vornehmen:\\n\\n* Sie müssen Serlo als Urheber nennen \\"Quelle: serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen die Lizenz angeben \\"Lizenz: CC BY-SA 4.0\\", in digitaler Form als Link zu dieser Seite: https://creativecommons.org/licenses/by-sa/4.0/\\n\\n/// Beispiel\\nWenn Sie einen Artikel von Serlo für ihre Schüler*innen kopieren, dann müssen Sie folgenden Vermerk ergänzen: **\\"Quelle: serlo.org, Lizenz: CC BY-SA 4.0\\"**\\n///\\n\\n\\n### Wenn Sie **Veränderungen** vornehmen:\\n\\n* Sie müssen Serlo als Urheber nennen \\"Quelle: serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen knapp angeben, welche Änderungen Sie vorgenommen haben \\"Zahlen vereinfacht\\" oder \\"Bild zugeschnitten\\".\\n* Sie müssen die Lizenz angeben \\"Lizenz: CC BY-SA 4.0\\", in digitaler Form als Link zu dieser Seite: https://creativecommons.org/licenses/by-sa/4.0/. Die Lizenz muss für das gesamte Werk angegeben werden, zu dem Inhalt von Serlo beigetragen hat.\\n\\n/// Beispiel\\n\\n#### Beispiel 1\\n\\nWenn Sie ein Bild von Serlo bearbeiten und es in Ihr Arbeitsblatt integrieren, dann müssen Sie folgenden Vermerk bei dem Bild ergänzen: **\\"Quelle: serlo.org, Veränderungen: ...\\"** und folgenden Vermerk für das ganze Arbeitsblatt: **Lizenz: CC BY-SA 4.0\\"**\\n\\n#### Beispiel 2\\n\\nWenn Sie einen Textbaustein von Serlo in einen Text von Ihnen integrieren, dann müssen Sie zu dem gesamten Text folgendes vermerken: **\\"Teilquelle: serlo.org, Lizenz: CC BY-SA 4.0\\"**\\n\\n///"}],[{"col":24,"content":"### Offizielle Lizenz\\n\\nDies ist eine allgemeinverständliche Zusammenfassung der [offiziellen Lizenz](https://creativecommons.org/licenses/by-sa/4.0/legalcode) und ersetzt diese nicht."}]]',
    agreement:
      'Mit dem Speichern dieser Seite versicherst du, dass du deinen Beitrag (damit sind auch Änderungen gemeint) selbst verfasst hast bzw. dass er keine fremden Rechte verletzt. Du willigst ein, deinen Beitrag unter der <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons Attribution/Share-Alike Lizenz 4.0</a> und/oder unter einer gleichwertigen Lizenz zu veröffentlichen, welche der Serlo Education e. V. entsprechend der Regelungen in den <a href="/21654">Nutzungsbedingungen</a> festlegen darf. Falls du den Beitrag nicht selbst verfasst hast, muss er unter den <a href="/21654">Nutzungsbedingungen</a> verfügbar sein und du stimmst zu, notwendigen Lizenzanforderungen zu folgen.',
  },
  {
    id: 4,
    instance: Instance.De,
    default: false,
    title:
      'Dieses Werk steht unter der freien Lizenz CC BY-SA 4.0 mit Namensnennung von Herrn Rudolf Brinkmann',
    shortTitle: '123mathe.de',
    url: 'https://123mathe.de',
    content:
      '[[{"col":24,"content":"Die Aufgabenstellung stammt von der Mathematik Lernseite [https://123mathe.de/](https://123mathe.de/) und wurde von Herrn Rudolf Brinkmann erstellt. Serlo dankt Frau Charlotte Brinkmann für die freundliche Genehmigung zur Veröffentlichung.\\n\\nDie Aufgabe steht unter der Lizenz **CC BY-SA 4.0**. Sie dürfen die Aufgabe beliebig kopieren, vervielfältigen, bearbeiten und weiterentwickeln - für verschiedene (auch kommerzielle) Zwecke. Dies gilt unter folgenden Bedingungen:\\n\\n### Wenn Sie **keine** Veränderungen vornehmen:\\n * Sie müssen 123mathe.de und Serlo als Urheber nennen \\"Quelle: 123mathe.de & serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen die Lizenz angeben \\"Lizenz: CC BY-SA 4.0\\", in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-sa/4.0/] (https://creativecommons.org/licenses/by-sa/4.0/)\\n\\n/// Beispiel\\nWenn Sie eine Aufgabe von Herrn Brinkmann auf Serlo für ihre Schüler/innen kopieren, dann müssen Sie folgenden Vermerk ergänzen:**\\"Quelle: 123mathe.de & serlo.org, Lizenz: CC BY-SA 4.0\\"**\\n///\\n\\n### Wenn Sie Veränderungen vornehmen:\\n* Sie müssen 123mathe.de und Serlo als Urheber nennen \\"Quelle: 123mathe.de & serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen kurz erläutern, welche Änderungen sie vorgenommen haben, z.B. \\"Zahlen vereinfacht\\" oder \\"Bild zugeschnitten\\".\\n* Sie müssen die Lizenz \\"CC BY-SA 4.0\\" angeben, in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-sa/4.0/](https://creativecommons.org/licenses/by-sa/4.0/).\\nDie Lizenz muss für das gesamte Werk angegeben werden, zu dem dieser Inhalt beigetragen hat.\\n/// Beispiel\\nWenn Sie eine Aufgabe von 123mathe.de & Serlo bearbeiten und es in Ihr Arbeitsblatt integrieren, dann müssen Sie folgenden Vermerk bei dem Bild ergänzen: **\\"Quelle: 123mathe.de & serlo.org, Veränderungen: …\\"** und folgenden Vermerk für die Aufgabe: Lizenz: **\\"CC BY-SA 4.0\\"**\\n\\n///\\n"}]]',
    agreement:
      'Mit dem Speichern dieser Seite versicherst du, dass du die Veränderung des Beitrags von Herrn Rudolf Brinkmann selbst verfasst hast bzw. dass er keine fremden Rechte verletzt. Du willigst ein, deinen Beitrag unter der <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons Attribution/Share-Alike Lizenz 4.0</a> und/oder unter einer gleichwertigen Lizenz zu veröffentlichen, welche der Serlo Education e. V. entsprechend der Regelungen in den <a href="/21654">Nutzungsbedingungen</a> festlegen darf. Der Beitrag von Herrn Rudolf Brinkmann muss unter den <a href="/21654">Nutzungsbedingungen</a> verfügbar sein und du stimmst zu, notwendigen Lizenzanforderungen zu folgen.',
  },
  {
    id: 6,
    instance: Instance.De,
    default: false,
    title:
      'Dieses Werk steht unter der freien Lizenz CC BY-SA 4.0 mit Namensnennung von Herrn Franz Strobl.',
    shortTitle: 'strobl-f.de',
    url: 'http://www.strobl-f.de/',
    content:
      '[[{"col":24,"content":"\\n\\n\\nDie Aufgenstellung stammt von der Mathematik Lernseite [www.strobl-f.de](http://www.strobl-f.de) und wurde von Herrn Franz Strobl erstellt. Serlo dankt für die freundliche Genehmigung zur Veröffentlichung.\\n\\nDie Aufgabe steht unter der **Lizenz CC BY-SA 4.0.**\\n Sie dürfen die Aufgabe beliebig kopieren, vervielfältigen, bearbeiten und weiterentwickeln - für verschiedene (auch kommerzielle) Zwecke. Dies gilt unter folgenden Bedingungen:\\n\\n### Wenn Sie **keine** Veränderungen vornehmen:\\n\\n* Sie müssen Strobl und Serlo als Urheber nennen \\"Quelle: strobl-f.de & serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen die Lizenz angeben \\"Lizenz: CC BY-SA 4.0\\", in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-sa/4.0/](https://creativecommons.org/licenses/by-sa/4.0)\\n\\n/// Beispiel\\nWenn Sie eine Aufgabe von Herrn Strobl auf Serlo für ihre Schüler*innen kopieren, dann müssen Sie folgenden Vermerk ergänzen: **\\"Quelle: strobl-f.de & serlo.org, Lizenz: CC BY-SA 4.0\\"**\\n///\\n\\n\\n### Wenn Sie Veränderungen vornehmen:\\n\\n* Sie müssen Strobl und Serlo als Urheber nennen \\"Quelle: strobl-f.de & serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen kurz erläutern, welche Änderungen sie vorgenommen haben, z.B. \\"Zahlen vereinfacht\\" oder \\"Bild zugeschnitten\\".\\n* Sie müssen die Lizenz \\"CC BY-SA 4.0\\" angeben, in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-sa/4.0/](https://creativecommons.org/licenses/by-sa/4.0). Die Lizenz muss für das gesamte Werk angegeben werden, zu dem dieser Inhalt beigetragen hat.\\n\\n/// Beispiel\\n\\nWenn Sie eine Aufgabe von Raschweb & Serlo bearbeiten und es in Ihr Arbeitsblatt integrieren, dann müssen Sie folgenden Vermerk bei dem Bild ergänzen: **\\"Quelle: strobl-f.de & serlo.org, Veränderungen: ...\\"** und folgenden Vermerk für die Aufgabe: **Lizenz: CC BY-SA 4.0\\"**\\n\\n///\\n"}]]',
    agreement:
      'Mit dem Speichern dieser Seite versicherst du, dass du die Veränderung des Beitrags von Herrn Franz Strobl selbst verfasst hast bzw. dass er keine fremden Rechte verletzt. Du willigst ein, deinen Beitrag unter der <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons Attribution/Share-Alike Lizenz 4.0</a> und/oder unter einer gleichwertigen Lizenz zu veröffentlichen, welche der Serlo Education e. V. entsprechend der Regelungen in den <a href="/21654">Nutzungsbedingungen</a> festlegen darf. Der Beitrag von Herrn Franz Strobl muss unter den <a href="/21654">Nutzungsbedingungen</a> verfügbar sein und du stimmst zu, notwendigen Lizenzanforderungen zu folgen.\r\n',
  },
  {
    id: 7,
    instance: Instance.De,
    default: false,
    title:
      'Dieses Werk steht unter der freien Lizenz CC BY-SA 4.0 mit Namensnennung von Herrn Günther Rasch',
    shortTitle: 'raschweb.de',
    url: 'http://www.raschweb.de/',
    content:
      '[[{"col":24,"content":"Die Aufgenstellung stammt von der Mathematik Lernseite [www.raschweb.de](http://www.raschweb.de/) und wurde von Herrn Günther Rasch erstellt. Serlo dankt für die freundliche Genehmigung zur Veröffentlichung.\\n\\nDie Aufgabe steht unter der **Lizenz CC BY-SA 4.0.**\\n Sie dürfen die Aufgabe beliebig kopieren, vervielfältigen, bearbeiten und weiterentwickeln - für verschiedene (auch kommerzielle) Zwecke. Dies gilt unter folgenden Bedingungen:\\n\\n### Wenn Sie **keine** Veränderungen vornehmen:\\n\\n* Sie müssen Raschweb und Serlo als Urheber nennen \\"Quelle: raschweb.de & serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen die Lizenz angeben \\"Lizenz: CC BY-SA 4.0\\", in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-sa/4.0/](https://creativecommons.org/licenses/by-sa/4.0)\\n\\n/// Beispiel\\nWenn Sie eine Aufgabe von Herrn Rasch auf Serlo für ihre Schüler*innen kopieren, dann müssen Sie folgenden Vermerk ergänzen: **\\"Quelle: raschweb.de & serlo.org, Lizenz: CC BY-SA 4.0\\"**\\n///\\n\\n\\n### Wenn Sie Veränderungen vornehmen:\\n\\n* Sie müssen Raschweb und Serlo als Urheber nennen \\"Quelle: raschweb.de & serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen kurz erläutern, welche Änderungen sie vorgenommen haben, z.B. \\"Zahlen vereinfacht\\" oder \\"Bild zugeschnitten\\".\\n* Sie müssen die Lizenz \\"CC BY-SA 4.0\\" angeben, in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-sa/4.0/](https://creativecommons.org/licenses/by-sa/4.0). Die Lizenz muss für das gesamte Werk angegeben werden, zu dem dieser Inhalt beigetragen hat.\\n\\n/// Beispiel\\n\\nWenn Sie eine Aufgabe von Raschweb & Serlo bearbeiten und es in Ihr Arbeitsblatt integrieren, dann müssen Sie folgenden Vermerk bei dem Bild ergänzen: **\\"Quelle: raschweb.de & serlo.org, Veränderungen: ...\\"** und folgenden Vermerk für die Aufgabe: **Lizenz: CC BY-SA 4.0\\"**\\n\\n///\\n"}]]',
    agreement:
      'Mit dem Speichern dieser Seite versicherst du, dass du die Veränderung des Beitrags von Herrn Günther Rasch selbst verfasst hast bzw. dass er keine fremden Rechte verletzt. Du willigst ein, deinen Beitrag unter der <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons Attribution/Share-Alike Lizenz 4.0</a> und/oder unter einer gleichwertigen Lizenz zu veröffentlichen, welche der Serlo Education e. V. entsprechend der Regelungen in den <a href="/21654">Nutzungsbedingungen</a> festlegen darf. Der Beitrag von Herrn Günther Rasch muss unter den <a href="/21654">Nutzungsbedingungen</a> verfügbar sein und du stimmst zu, den notwendigen Lizenzanforderungen zu folgen.',
  },
  {
    id: 10,
    instance: Instance.De,
    default: false,
    title: 'Dieses Werk steht unter der Standard-YouTube-Lizenz',
    shortTitle: 'Standard-Youtube-Lizenz',
    url: 'https://www.youtube.com/static?gl=DE&template=terms',
    content: 'Standard-YouTube-Lizenz',
    agreement: '',
  },
  {
    id: 16,
    instance: Instance.De,
    default: false,
    title: 'Dieses Werk steht unter der Lizenz CC BY-ND 4.0',
    shortTitle: 'CC BY-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
    content:
      '[[{"col":24,"content":"Sie dürfen das **Lernmaterial** **vervielfältigen und verbreiten**. \\n\\nDies gilt unter folgenden Bedingungen:  \\n* Sie müssen Serlo als Urheber nennen \\"Quelle: serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen die Lizenz angeben \\"Lizenz: CC BY-ND 4.0\\", in digitaler Form als Link zu [dieser Seite](https://creativecommons.org/licenses/by-nd/4.0/deed.de).\\n\\n/// Beispiel\\nWenn Sie einen unveränderten Textbaustein, bspw. ein Video, von Serlo in einen Text von Ihnen integrieren, dann müssen Sie zu dem gesamten Text folgendes vermerken: \\"Video: serlo.org, Lizenz: CC BY-ND 4.0\\"\\n///\\n\\nWenn Sie das Material **verändern**, dürfen Sie die bearbeitete Fassung des Materials ***nicht* verbreiten**.\\n"}],[{"col":24,"content":"###Offizielle Lizenz\\n\\nDies ist eine allgemeinverständliche Zusammenfassung der [offiziellen Lizenz](https://creativecommons.org/licenses/by-nd/4.0/deed.de)\\nund ersetzt diese nicht.\\n"}]]',
    agreement:
      'Mit dem Speichern dieser Seite versicherst du, dass du deinen Beitrag (damit sind auch Änderungen gemeint) selbst verfasst hast bzw. dass er keine fremden Rechte verletzt. Du willigst ein, deinen Beitrag unter der <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons Attribution/Share-Alike Lizenz 4.0</a> und/oder unter einer gleichwertigen Lizenz zu veröffentlichen, welche der Serlo Education e. V. entsprechend der Regelungen in den <a href="/21654">Nutzungsbedingungen</a> festlegen darf. Falls du den Beitrag nicht selbst verfasst hast, muss er unter den <a href="/21654">Nutzungsbedingungen</a> verfügbar sein und du stimmst zu, notwendigen Lizenzanforderungen zu folgen.\r\n\r\nDas Video steht unter der Lizenz CC BY-ND, d.h. es dürfen keine Änderungen vorgenommen werden.\r\n',
  },
  {
    id: 19,
    instance: Instance.De,
    default: false,
    title:
      'Dieses Werk steht unter der freien Lizenz CC BY 4.0 mit Namensnennung Landesbildungsserver Baden-Württemberg',
    shortTitle: 'schule-bw.de',
    url: 'https://www.schule-bw.de/',
    content:
      '[[{"col":24,"content":"Dieser Lerninhalt stammt vom Landesbildungsserver Baden-Württemberg [www.schule-bw.de](https://www.schule-bw.de/). Serlo dankt für die freundliche Genehmigung zur Veröffentlichung.\\n\\nDer Lerninhalt steht unter der **Lizenz CC BY 4.0.**\\nSie dürfen das Werk beliebig kopieren, vervielfältigen, bearbeiten und weiterentwickeln - für verschiedene (auch kommerzielle) Zwecke. Dies gilt unter folgenden Bedingungen:\\n\\n### Wenn Sie **keine** Veränderungen vornehmen:\\n\\n* Sie müssen den Landesbildungsserver Baden-Württemberg als Urheber nennen \\"Quelle: Ausgangsmaterialien des Landesbildungsservers Baden-Württemberg (www.schule-bw.de) am Institut für Bildungsanalysen Baden-Württemberg (IBBW) (https://ibbw.kultus-bw.de)\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen die Lizenz angeben \\"Lizenz: CC BY 4.0\\", in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by/4.0/deed.de](https://creativecommons.org/licenses/by/4.0/deed.de).\\n\\n/// Beispiel\\nWenn Sie einen Lerninhalt vom Landesbildungsserver Baden-Württemberg auf Serlo für ihre Schüler*innen kopieren, dann müssen Sie folgenden Vermerk ergänzen: **\\"Quelle: Ausgangsmaterialien des Landesbildungsservers Baden-Württemberg (www.schule-bw.de) am Institut für Bildungsanalysen Baden-Württemberg (IBBW) (https://ibbw.kultus-bw.de)**\\n///\\n\\n\\n### Wenn Sie Veränderungen vornehmen:\\n\\n* Sie müssen den Landesbildungsserver Baden-Württemberg als Urheber nennen \\"Quelle: Ausgangsmaterialien des Landesbildungsservers Baden-Württemberg (www.schule-bw.de) am Institut für Bildungsanalysen Baden-Württemberg (IBBW) (https://ibbw.kultus-bw.de)\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen kurz erläutern, welche Änderungen sie vorgenommen haben, z.B. \\"Zahlen vereinfacht\\" oder \\"Bild zugeschnitten\\".\\n* Sie müssen die Lizenz \\"CC BY 4.0\\" angeben, in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by/4.0/deed.de](https://creativecommons.org/licenses/by/4.0/deed.de). Die Lizenz muss für das gesamte Werk angegeben werden, zu dem dieser Inhalt beigetragen hat.\\n\\n/// Beispiel\\n\\nWenn Sie eine Lerninhalt vom Landesbildungsserver Baden-Württemberg bearbeiten und es in Ihr Arbeitsblatt integrieren, dann müssen Sie folgenden Vermerk bei dem Bild ergänzen: **\\"Quelle: Ausgangsmaterialien des Landesbildungsservers Baden-Württemberg (www.schule-bw.de) am Institut für Bildungsanalysen Baden-Württemberg (IBBW) (https://ibbw.kultus-bw.de), Veränderungen: ...\\"** und folgenden Vermerk für die Aufgabe: **Lizenz: CC BY 4.0\\"**\\n\\n///\\n"}]]',
    agreement: '',
  },
  {
    id: 24,
    instance: Instance.De,
    default: false,
    title:
      'Dieses Werk steht unter der freien Lizenz CC BY-SA 4.0 mit Namensnennung von MNWeG',
    shortTitle: 'MNWeG',
    url: 'https://mnweg.org',
    content:
      '[[{"col":24,"content":"Das Material stammt von der Seite [mnweg.org](https://mnweg.org/). Serlo dankt dem Materialnetzwerk (MNWeG) für die freundliche Genehmigung zur Veröffentlichung.\\n\\nDas Material steht unter der Lizenz **CC BY-SA 4.0**. Sie dürfen das Material beliebig kopieren, vervielfältigen, bearbeiten und weiterentwickeln - für verschiedene (auch kommerzielle) Zwecke. Dies gilt unter folgenden Bedingungen:\\n\\n### Wenn Sie **keine** Veränderungen vornehmen:\\n * Sie müssen MNWeG und Serlo als Urheber nennen \\"Quelle: mnweg.org & serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen die Lizenz angeben \\"Lizenz: CC BY-SA 4.0\\", in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-sa/4.0/] (https://creativecommons.org/licenses/by-sa/4.0/)\\n\\n/// Beispiel\\nWenn Sie eine Aufgabe von MNWeG auf Serlo für ihre Schüler/innen kopieren, dann müssen Sie folgenden Vermerk ergänzen:**\\"Quelle: mnweg.org & serlo.org, Lizenz: CC BY-SA 4.0\\"**\\n///\\n\\n### Wenn Sie Veränderungen vornehmen:\\n* Sie müssen MNWeG und Serlo als Urheber nennen \\"Quelle: mnweg.org & serlo.org\\", in digitaler Form als Link direkt zum Lernmaterial.\\n* Sie müssen kurz erläutern, welche Änderungen sie vorgenommen haben, z.B. \\"Zahlen vereinfacht\\" oder \\"Bild zugeschnitten\\".\\n* Sie müssen die Lizenz \\"CC BY-SA 4.0\\" angeben, in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-sa/4.0/](https://creativecommons.org/licenses/by-sa/4.0/).\\nDie Lizenz muss für das gesamte Werk angegeben werden, zu dem dieser Inhalt beigetragen hat.\\n/// Beispiel\\nWenn Sie eine Aufgabe von MNWeG & Serlo bearbeiten und es in Ihr Arbeitsblatt integrieren, dann müssen Sie folgenden Vermerk bei dem Bild ergänzen: **\\"Quelle: mnweg.org & serlo.org, Veränderungen: …\\"** und folgenden Vermerk für die Aufgabe: Lizenz: **\\"CC BY-SA 4.0\\"**\\n\\n///"}]]',
    agreement:
      'Mit dem Speichern dieser Seite versicherst du, dass du die Veränderung des Beitrags von MNWeG selbst verfasst hast bzw. dass er keine fremden Rechte verletzt. Du willigst ein, deinen Beitrag unter der <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons Attribution/Share-Alike Lizenz 4.0</a> und/oder unter einer gleichwertigen Lizenz zu veröffentlichen, welche der Serlo Education e. V. entsprechend der Regelungen in den <a href="/21654">Nutzungsbedingungen</a> festlegen darf. Der Beitrag von MNWeG muss unter den <a href="/21654">Nutzungsbedingungen</a> verfügbar sein und du stimmst zu, notwendigen Lizenzanforderungen zu folgen.',
  },
  {
    id: 25,
    instance: Instance.De,
    default: false,
    title:
      'Dieses Werk steht unter der freien Lizenz CC BY-SA 4.0 mit Namensnennung vom Chancenwerk',
    shortTitle: 'Chancenwerk',
    url: 'https://chancenwerk.de/',
    content:
      '[[{"col":24,"content":"Dieser Inhalt wurde vom [Chancenwerk](https://chancenwerk.de/) erstellt und ggf in Zusammenarbeit mit Serlo Autor*innen weiterentwickelt. Der Chancenwerk e.V. hält das Urheberrecht an diesem Inhalt. Serlo dankt für die freundliche Genehmigung zur Veröffentlichung.\\n\\nDer Lerninhalt steht unter der **Lizenz CC BY SA 4.0.**\\nDu darfst das Werk kopieren, vervielfältigen, bearbeiten und weiterentwickeln. Dies gilt unter folgenden Bedingungen:\\n\\n### Wenn du **keine** Veränderungen vornimmst:\\n\\n* Du musst Serlo und das Chancenwerk als Quelle nennen \\"Quelle: serlo.org & Chancenwerk\\", in digitaler Form als Link direkt zu diesem Inhalt.\\n* Du musst die Lizenz angeben \\"Lizenz: CC BY SA 4.0\\", in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-sa/4.0/deed.de](https://creativecommons.org/licenses/by-sa/4.0/deed.de).\\n\\n### Wenn du Veränderungen vornimmst:\\n\\n* Du musst Serlo und das Chancenwerk als Quelle nennen\\"Quelle: serlo.org & Chancenwerk\\", in digitaler Form als Link direkt zu diesem Inhalt.\\n* Du musst kurz erläutern, welche Änderungen du vorgenommen hast, z.B. \\"Zahlen vereinfacht\\" oder \\"Bild zugeschnitten\\".\\n* Du musst die Lizenz \\"CC BY SA 4.0\\" angeben, in digitaler Form als Link zu dieser Seite: [https://creativecommons.org/licenses/by-a/4.0/deed.de](https://creativecommons.org/licenses/by-sa/4.0/deed.de). Die Lizenz muss für das gesamte Werk angegeben werden, zu dem dieser Inhalt beigetragen hat."}]]',
    agreement: `Mit dem Speichern dieser Seite versichere ich, dass ich die Veränderung des Inhalts selbst verfasst habe bzw. dass meine Änderungen keine fremden Rechte verletzen. Ich willige ein, meinen Beitrag unter der <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">Creative Commons Attribution/Share-Alike Lizenz 4.0</a> und/oder unter einer gleichwertigen Lizenz zu veröffentlichen, welche der Serlo Education e. V. entsprechend der Regelungen in den <a href="/terms">Nutzungsbedingungen</a> festlegen darf. Let's go 🤘`,
  },
  defaultLicense,
  {
    id: 14,
    instance: Instance.Es,
    default: true,
    title: 'Este contenido está licenciado bajo CC BY-SA 4.0',
    shortTitle: 'CC BY-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
    content: '',
    agreement:
      'Al guardar esta página, confirmas que tu contribución (incluyendo cualquier edición que hayas realizado) es tu propio trabajo, y que no infringe los derechos de terceros. Consiente en publicar su contribución bajo la <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es">Licencia Creative Commons Attribution/Share-Alike 4.0</a> y/o bajo una licencia equivalente elegida por Serlo Education e.V. de acuerdo con las normas establecidas en las <a href="https://es.serlo.org/terms">condiciones de uso</a>. En caso de que la contribución no sea un trabajo propio, deberá estar disponible de acuerdo con los <a href="https://es.serlo.org/terms">términos de uso</a>, y deberá aceptar cumplir con cualquier solicitud de licencia necesaria.',
  },
  {
    id: 21,
    instance: Instance.Es,
    default: false,
    title: 'Licencia estándar de YouTube',
    shortTitle: 'Licencia estándar de YouTube',
    url: 'https://www.youtube.com/static?template=terms&gl=ES',
    content: '[[{"col":24,"content":"Licencia estándar de YouTube"}]]',
    agreement: '',
  },
  {
    id: 22,
    instance: Instance.Es,
    default: false,
    title:
      'Esta obra está bajo la licencia libre CC BY-SA 4.0 de la iniciativa colectiva África en la Escuela',
    shortTitle: 'África en la Escuela',
    url: 'https://www.facebook.com/AfricaenlaEscuela/',
    content:
      '[[{"col":24,"content":"Esta obra es trabajo original realizado por los miembros y colaboradores de la  [iniciativa colectiva África en la Escuela.](https://www.facebook.com/AfricaenlaEscuela/) \\nSerlo agradece a África en la Escuela el amable permiso de publicación.\\n\\nEl contenido esta bajo la licencia libre [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es) Puedes copiar y redistribuir el material en cualquier medio o formato. También remezclar, transformar y construir a partir del material para cualquier propósito (incluso comercialmente.) Bajo las siguientes condiciones:\\n\\n**Si no haces *ningún* cambio:**\\n* Debes acreditar a África en la Escuela y Serlo como autor asi,  \\"Fuente: África en la Escuela & serlo.org\\", en forma digital como un enlace directamente al material de aprendizaje.\\n* Debes indicar la licencia \\"Licencia: CC BY-SA 4.0\\", en forma digital como enlace a esta página: [https://creativecommons.org/licenses/by-sa/4.0/deed.es](https://creativecommons.org/licenses/by-sa/4.0/deed.es)\\n\\n/// Ejemplo\\nSi copias el material educativo de África en la Escuela tomado de la página web de Serlo para tus alumnos o institución educativa, tienes que añadir la siguiente nota: \\n\\n\\"**Fuente: África en la Escuela & serlo.org, Licencia: CC BY-SA 4.0**\\".\\n///\\n\\n\\n**Cuando haces *algún* cambio:**\\n* Debes acreditar a África en la Escuela y Serlo como autor así,  \\"Fuente: África en la Escuela & serlo.org\\", en forma digital como un enlace directamente al material de aprendizaje. \\n* Debes explicar brevemente qué cambios se han realizado, por ejemplo, \\"Nuevas gráficas\\", \\"Nuevas citas\\",  \\"Imágenes alteradas\\" o, “cambios en el texto”.\\n* Debes indicar la licencia \\"Licencia: CC BY-SA 4.0\\", en forma digital como enlace a esta página: [https://creativecommons.org/licenses/by-sa/4.0/deed.es](https://creativecommons.org/licenses/by-sa/4.0/deed.es) La licencia debe darse para toda la obra a la que ha contribuido este contenido.\\n\\n/// Ejemplo\\nSi editas algo de África en la Escuela & Serlo y la integras en algun trabajo tuyo, debes añadir la siguiente nota: \\n\\n\\"**Fuente: África en la Escuela & serlo.org, modificaciones: _ _ _ _. Licencia: CC BY-SA 4.0**\\".\\n\\nNo olvides listar las modificaciones hechas y poner el enlace original al material.\\n///"}]]',
    agreement: '',
  },
  {
    id: 23,
    instance: Instance.Es,
    default: false,
    title:
      ' Este ejercicio/tarea está bajo la licencia libre CC BY-SA 4.0 del señor Franz Strobl.',
    shortTitle: 'strobl-f.de',
    url: 'http://www.strobl-f.de/',
    content:
      '[[{"col":24,"content":"Las tareas/ejercicios proceden del sitio en alemán de aprendizaje de matemáticas [www.strobl-f.de](http://www.strobl-f.de/) y fue creada por el Sr. Franz Strobl. Serlo agradece el amable permiso de publicación.\\n\\nLa tarea/ejercicio está licenciada bajo CC BY-SA 4.0 Puede copiar, reproducir, editar y desarrollar la tarea como desee, para diversos fines (incluso comerciales). Esto se aplica bajo las siguientes condiciones:\\n\\n**Si no realiza ningún cambio:**\\n* Debe acreditar a Strobl y Serlo como autores \\"Fuente: strobl-f.de & serlo.org\\", en forma digital como un enlace directo al material de aprendizaje.\\nDebe indicar la licencia \\"Licencia: CC BY-SA 4.0\\", en forma digital como un enlace a esta página:\\n[https://creativecommons.org/licenses/by-sa/4.0/deed.es](https://creativecommons.org/licenses/by-sa/4.0/deed.es)\\n\\n/// Ejemplo\\nSi copias una tarea/ejercicio del Sr. Strobl en Serlo para tus alumnos, tienes que añadir la siguiente nota: \\"Fuente: strobl-f.de & serlo.org, Licencia: CC BY-SA 4.0\\".\\n///\\n\\n**Si haces algún cambio:**\\n* Debe acreditar a Strobl y Serlo como autores \\"Fuente: strobl-f.de & serlo.org\\", en forma digital como un enlace directo al material de aprendizaje.\\n* Debe explicar brevemente qué cambios ha realizado, por ejemplo, \\"figuras simplificadas\\" o \\"imagen recortada\\".\\n* Deben indicar la licencia \\"CC BY-SA 4.0\\", en forma digital como un enlace a esta página: [https://creativecommons.org/licenses/by-sa/4.0/deed.es](https://creativecommons.org/licenses/by-sa/4.0/deed.es) . La licencia debe darse para toda la obra a la que ha contribuido este contenido.\\n\\n/// Ejemplo\\nSi edita una tarea del Sr. Strobl & Serlo y la integra en su hoja de trabajo, debe añadir la siguiente nota a la imagen: \\"Fuente: strobl-f.de & serlo.org, modificaciones: ...\\" y la siguiente nota para la tarea: Licencia: CC BY-SA 4.0\\".\\n///"}]]',
    agreement:
      'Al guardar esta página, confirmas que tu contribución (incluyendo cualquier edición que hayas realizado) es tu propio trabajo, y que no infringe los derechos de terceros. Consiente en publicar su contribución bajo la <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es">Licencia Creative Commons Attribution/Share-Alike 4.0</a> y/o bajo una licencia equivalente elegida por Serlo Education e.V. de acuerdo con las normas establecidas en las <a href="https://es.serlo.org/terms">condiciones de uso</a>. En caso de que la contribución no sea un trabajo propio, deberá estar disponible de acuerdo con los <a href="https://es.serlo.org/terms">términos de uso</a>, y deberá aceptar cumplir con cualquier solicitud de licencia necesaria.',
  },
  {
    id: 13,
    instance: Instance.Hi,
    default: true,
    title: 'This content is licensed under CC BY-SA 4.0',
    shortTitle: 'CC BY-SA 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    content: '[[{"col":24,"content":"tbd"}]]',
    agreement:
      'By saving this page, you confirm that your contribution (including any edits you have made) is your own work, and that it does not infringe on the rights of third parties. You consent to publishing your contribution under the <a href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution/Share-Alike License 4.0</a> and/or under an equivalent license chosen by the Serlo Education e.V. in accordance with the regulations laid out in the <a href="https://hi.serlo.org/terms">terms of use</a>. Should the contribution not be your own work, it must be available in accordance with the <a href="https://hi.serlo.org/terms">terms of use</a>, and you must agree to comply with any necessary license requests.',
  },
  {
    id: 17,
    instance: Instance.Ta,
    default: true,
    title: 'This content is licensed under CC BY-SA 4.0',
    shortTitle: 'CC BY-SA 4.0',
    url: 'http://creativecommons.org/licenses/by/4.0/',
    content: '[[{"col":24,"content":"siehe de.serlo.org"}]]',
    agreement:
      'By saving this page, you confirm that your contribution (including any edits you have made) is your own work, and that it does not infringe on the rights of third parties. You consent to publishing your contribution under the <a href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution/Share-Alike License 4.0</a> and/or under an equivalent license chosen by the Serlo Education e.V. in accordance with the regulations laid out in the <a href="https://ta.serlo.org/terms">terms of use</a>. Should the contribution not be your own work, it must be available in accordance with the <a href="https://ta.serlo.org/terms">terms of use</a>, and you must agree to comply with any necessary license requests.',
  },
  {
    id: 18,
    instance: Instance.Fr,
    default: true,
    title: 'Ce contenu est sous licence CC BY-SA 4.0',
    shortTitle: 'CC BY-SA 4.0',
    url: 'http://creativecommons.org/licenses/by/4.0/',
    content:
      '[[{"col":24,"content":"Pour plus d\'informations: [de.serlo.org](de.serlo.org)"}]]',
    agreement:
      'En sauvegardant cette page, tu confirmes que ta contribution (incluant chaque modification) est ton propre travail et qu’elle ne viole pas les droits de tiers. Tu consentes de publier ta contribution sous licence <a href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution/Share-Alike License 4.0</a> et/ou sous une licence équivalente choisie par la Société pour l’éducation ouverte (Gesellschaft für freie Bildung e. V.) conformément aux régulations établies dans <a href="https://fr.serlo.org/terms">terms of use</a>. Si votre contribution n’est pas votre propre travail, elle doit être disponible conformément aux <a href="https://fr.serlo.org/terms">modalités d’utilisations</a>, et tu dois accepter de satisfaire toute demande de licence nécessaire.',
  },
]

export function getDefaultLicense(instance: Instance): License {
  return (
    licenses.find(
      (license) => license.default && license.instance == instance
    ) ?? defaultLicense
  )
}
