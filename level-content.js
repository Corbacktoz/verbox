import { allowedVerbs, levelTenses, tenses, verbs, persons, phrase } from './core.js';

export const verbCategories = [
  {label:'Premier groupe : les verbes en -er', includes:v=>v.group===1},
  {label:'Deuxième groupe : -ir et -issons', includes:v=>v.group===2},
  {label:'Être et avoir, deux verbes qui servent aussi d’auxiliaires', includes:v=>['être','avoir'].includes(v.infinitive)},
  {label:'Autres verbes du troisième groupe', includes:v=>v.group===3&&!['être','avoir'].includes(v.infinitive)}
];

export const levelGuides = {
  CE2:{
    method:'Repère le sujet : qui fait l’action ? Remplace un prénom par il ou elle, puis plusieurs prénoms par ils ou elles. Choisis ensuite le temps. Les verbes en -er (chanter, jouer, manger...), être, avoir et les 8 verbes irréguliers du programme (faire, aller, dire, venir, pouvoir, voir, vouloir, prendre) font partie de ton entraînement. Lis chaque correction pour comprendre la terminaison.',
    goal:'Distinguer le présent, l’imparfait, le futur et le passé composé',
    practice:'Travaille d’abord un seul temps. Quand tu te sens à l’aise, compare le présent, le futur et le passé composé du même verbe : nous chantons, nous chanterons, nous avons chanté. Pour être, avoir et les verbes irréguliers (faire, aller, dire, venir, pouvoir, voir, vouloir, prendre), apprends les formes avec leur sujet : nous sommes, vous avez, ils vont, nous faisons, ils disent, je peux, tu veux, il prend. Fais attention aux verbes comme manger (nous mangeons) et commencer (nous commençons).',
    mistakes:[
      {verb:'manger',tense:'present',index:3,wrong:'nous mangons',correct:'nous mangeons',why:'Avec nous au présent, les verbes en -ger prennent un e après le g pour garder le son [ʒ].'},
      {verb:'aller',tense:'present',index:5,wrong:'ils vonts',correct:'ils vont',why:'La forme ils vont s’écrit sans s à la fin.'},
      {verb:'avoir',tense:'futur',index:0,wrong:'j’aurais',correct:'j’aurai',why:'Pour dire ce qui arrivera demain au futur simple, écris j’aurai, sans s.'}
    ]
  },
  CM1:{
    method:'Tu retrouves les temps simples du CE2 et tu consolides le passé composé. Travaille les verbes fréquents du 2e et du 3e groupe : finir, choisir, ainsi qu’aller, venir, partir, mettre, prendre, faire, dire, voir, vouloir et pouvoir. Observe les formes qui changent : nous prenons mais ils prennent ; je mets, nous mettons ; nous voyons, je veux, je peux.',
    goal:'Passer d’un temps simple à un temps composé',
    practice:'Au passé composé, cherche l’auxiliaire et le participe passé. Utilise l’auxiliaire avoir (j’ai fini, nous avons chanté, il a mis, nous avons vu, ils ont voulu) et l’auxiliaire être pour les verbes de déplacement comme aller, venir et partir (je suis allé, elle est venue, ils sont partis). Avec être, le participe passé s’accorde avec le sujet.',
    mistakes:[
      {verb:'finir',tense:'present',index:3,wrong:'nous finons',correct:'nous finissons',why:'Finir appartient au deuxième groupe : nous finissons s’écrit avec -iss-.'},
      {verb:'mettre',tense:'present',index:0,wrong:'je met',correct:'je mets',why:'Au présent, mettre prend un s avec je : je mets.'},
      {verb:'partir',tense:'compose',index:5,wrong:'ils sont parti',correct:'ils sont partis',why:'Avec l’auxiliaire être, le participe passé s’accorde avec le sujet : ils sont partis prend un s.'}
    ]
  },
  CM2:{
    method:'Tu travailles six temps sur les 48 verbes du primaire : verbes en -er, en -ir (finir, grandir...) et les verbes fréquents (être, avoir, aller, venir, partir, mettre, prendre, faire, dire, voir, vouloir, pouvoir, savoir, lire). Compare l’imparfait et le passé simple dans les récits, et utilise le plus-que-parfait pour l’antériorité.',
    goal:'Comprendre les temps du récit et maîtriser tous les verbes du primaire',
    practice:'Lis : il mettait son manteau quand son ami arriva. Mettait installe le décor ; arriva fait avancer l’action. Dans ils étaient partis avant l’averse, étaient partis indique une action passée avant une autre avec l’auxiliaire être. Entraîne-toi sur les formes délicates du passé simple (il mit, ils mirent, il vint, ils vinrent).',
    mistakes:[
      {verb:'voir',tense:'imparfait',index:3,wrong:'nous voyons',correct:'nous voyions',why:'Au temps demandé, l’imparfait, garde le y du radical et le i de -ions.'},
      {verb:'mettre',tense:'simple',index:2,wrong:'il metta',correct:'il mit',why:'Au passé simple, la 3e personne du singulier de mettre est il mit.'},
      {verb:'venir',tense:'parfait',index:4,wrong:'vous étiez venu',correct:'vous étiez venus',why:'Avec l’auxiliaire être au plus-que-parfait, le participe passé s’accorde au pluriel : vous étiez venus.'}
    ]
  }
};

export const tenseExamples = {
  present:{verb:'jouer',index:0,form:'joue',sentence:'Je joue dans le jardin.'},
  imparfait:{verb:'jouer',index:0,form:'jouais',sentence:'Chaque mercredi, je jouais dans le jardin.'},
  futur:{verb:'jouer',index:0,form:'jouerai',sentence:'Demain, je jouerai dans le jardin.'},
  compose:{verb:'jouer',index:0,form:'ai joué',sentence:'Hier, j’ai joué dans le jardin.'},
  simple:{verb:'jouer',index:2,form:'joua',sentence:'Ce jour-là, il joua dans le jardin.'},
  parfait:{verb:'jouer',index:0,form:'avais joué',sentence:'J’avais joué dans le jardin avant de rentrer.'}
};

export const levelTenseExercises = {
  CE2: {
    present: [
      { prompt: 'Tu (chanter) une jolie chanson.', answer: 'Tu chantes une jolie chanson.', verb: 'chanter', form: 'chantes', rule: 'Au présent, les verbes en -er prennent la terminaison -es avec le pronom personnel tu.' },
      { prompt: 'Nous (être) prêts pour la récréation.', answer: 'Nous sommes prêts pour la récréation.', verb: 'être', form: 'sommes', rule: 'Le verbe être a une forme particulière au présent avec nous : nous sommes.' },
      { prompt: 'Ils (avoir) de nouveaux feutres.', answer: 'Ils ont de nouveaux feutres.', verb: 'avoir', form: 'ont', rule: 'Le verbe avoir à la 3e personne du pluriel s’écrit ils ont (se termine par -ont).' },
      { prompt: 'Je (aller) à l’école à pied.', answer: 'Je vais à l’école à pied.', verb: 'aller', form: 'vais', rule: 'Aller est un verbe du 3e groupe : avec je au présent, on écrit je vais.' },
      { prompt: 'Nous (manger) une pomme à quatre heures.', answer: 'Nous mangeons une pomme à quatre heures.', verb: 'manger', form: 'mangeons', rule: 'Avec nous au présent, les verbes en -ger s’écrivent -geons pour conserver le son [ʒ].' }
    ],
    imparfait: [
      { prompt: 'Chaque mercredi, je (jouer) aux billes.', answer: 'Chaque mercredi, je jouais aux billes.', verb: 'jouer', form: 'jouais', rule: 'À l’imparfait, la terminaison avec je est toujours -ais.' },
      { prompt: 'Vous (parler) avec vos camarades.', answer: 'Vous parliez avec vos camarades.', verb: 'parler', form: 'parliez', rule: 'À l’imparfait, la terminaison avec vous est toujours -iez.' },
      { prompt: 'Elle (être) contente de son dessin.', answer: 'Elle était contente de son dessin.', verb: 'être', form: 'était', rule: 'Le verbe être utilise le radical ét- à l’imparfait : elle était (-ait avec elle).' },
      { prompt: 'Nous (avoir) un grand cahier bleu.', answer: 'Nous avions un grand cahier bleu.', verb: 'avoir', form: 'avions', rule: 'Le verbe avoir prend le radical av- à l’imparfait : nous avions (-ions avec nous).' },
      { prompt: 'Ils (aller) chez leurs grands-parents.', answer: 'Ils allaient chez leurs grands-parents.', verb: 'aller', form: 'allaient', rule: 'Avec ils ou elles, la terminaison de l’imparfait est toujours -aient : ils allaient.' }
    ],
    futur: [
      { prompt: 'Demain, tu (aimer) cette nouvelle histoire.', answer: 'Demain, tu aimeras cette nouvelle histoire.', verb: 'aimer', form: 'aimeras', rule: 'Au futur simple, pour les verbes en -er, on ajoute la terminaison -as à l’infinitif avec tu.' },
      { prompt: 'Je (être) le premier arrivé dans la cour.', answer: 'Je serai le premier arrivé dans la cour.', verb: 'être', form: 'serai', rule: 'Au futur simple, être prend le radical ser- et la terminaison -ai avec je : je serai.' },
      { prompt: 'Nous (avoir) beaucoup de temps pour lire.', answer: 'Nous aurons beaucoup de temps pour lire.', verb: 'avoir', form: 'aurons', rule: 'Au futur simple, avoir prend le radical aur- et la terminaison -ons avec nous : nous aurons.' },
      { prompt: 'Vous (aller) au gymnase vendredi après-midi.', answer: 'Vous irez au gymnase vendredi après-midi.', verb: 'aller', form: 'irez', rule: 'Au futur simple, aller prend le radical ir- et la terminaison -ez avec vous : vous irez.' },
      { prompt: 'Les enfants (manger) une part de gâteau.', answer: 'Les enfants mangeront une part de gâteau.', verb: 'manger', form: 'mangeront', rule: 'Avec un sujet au pluriel (les enfants = ils), la terminaison du futur est -ont : mangeront.' }
    ],
    compose: [
      { prompt: 'Hier, nous (jouer) à cache-cache dans la cour.', answer: 'Hier, nous avons joué à cache-cache dans la cour.', verb: 'jouer', form: 'avons joué', rule: 'Au passé composé, les verbes en -er se forment avec l’auxiliaire avoir au présent (avons) et le participe passé en -é (joué).' },
      { prompt: 'Tu (avoir) une très bonne idée pour le dessin.', answer: 'Tu as eu une très bonne idée pour le dessin.', verb: 'avoir', form: 'as eu', rule: 'Le passé composé du verbe avoir se forme avec l’auxiliaire avoir au présent (tu as) et le participe passé eu.' },
      { prompt: 'J’ (faire) tous mes exercices de lecture.', answer: 'J’ai fait tous mes exercices de lecture.', verb: 'faire', form: 'ai fait', rule: 'Le participe passé de faire est fait (avec un t muet) : avec j’, on écrit j’ai fait.' },
      { prompt: 'Les élèves (aller) à la bibliothèque de quartier.', answer: 'Les élèves sont allés à la bibliothèque de quartier.', verb: 'aller', form: 'sont allés', rule: 'Le verbe aller se conjugue avec l’auxiliaire être : avec le sujet au pluriel (les élèves = ils), le participe passé prend un s (sont allés).' },
      { prompt: 'Elle (prendre) son parapluie avant de sortir.', answer: 'Elle a pris son parapluie avant de sortir.', verb: 'prendre', form: 'a pris', rule: 'Le participe passé de prendre est pris (avec un s muet que l’on entend au féminin prise) : elle a pris.' }
    ]
  },
  CM1: {
    present: [
      { prompt: 'Nous (finir) la lecture de ce chapitre.', answer: 'Nous finissons la lecture de ce chapitre.', verb: 'finir', form: 'finissons', rule: 'Finir est un verbe du 2e groupe : avec nous au présent, la terminaison est -issons.' },
      { prompt: 'Ils (prendre) leurs affaires de géométrie.', answer: 'Ils prennent leurs affaires de géométrie.', verb: 'prendre', form: 'prennent', rule: 'Prendre à la 3e personne du pluriel double son n : ils prennent.' },
      { prompt: 'Vous (faire) un travail soigné.', answer: 'Vous faites un travail soigné.', verb: 'faire', form: 'faites', rule: 'Au présent avec vous, faire s’écrit vous faites (forme irrégulière sans -ez).' },
      { prompt: 'Je (mettre) mes affaires dans mon casier.', answer: 'Je mets mes affaires dans mon casier.', verb: 'mettre', form: 'mets', rule: 'Le verbe mettre se termine par -s avec je et tu au présent : je mets.' },
      { prompt: 'Tu (venir) avec nous à la piscine.', answer: 'Tu viens avec nous à la piscine.', verb: 'venir', form: 'viens', rule: 'Venir au présent prend le radical vien- et se termine par un s avec tu : tu viens.' }
    ],
    imparfait: [
      { prompt: 'Autrefois, je (finir) mes devoirs avant le dîner.', answer: 'Autrefois, je finissais mes devoirs avant le dîner.', verb: 'finir', form: 'finissais', rule: 'À l’imparfait, les verbes du 2e groupe intercalent -iss- : je finissais (-ais avec je).' },
      { prompt: 'Vous (dire) toujours la vérité.', answer: 'Vous disiez toujours la vérité.', verb: 'dire', form: 'disiez', rule: 'À l’imparfait, dire utilise le radical dis- et la terminaison -iez avec vous : vous disiez.' },
      { prompt: 'Nous (faire) des expériences en sciences.', answer: 'Nous faisions des expériences en sciences.', verb: 'faire', form: 'faisions', rule: 'Faire prend le radical fais- à l’imparfait : nous faisions (-ions avec nous).' },
      { prompt: 'Elles (partir) à l’école dès huit heures.', answer: 'Elles partaient à l’école dès huit heures.', verb: 'partir', form: 'partaient', rule: 'Avec le pronom elles, la terminaison de l’imparfait est toujours -aient : elles partaient.' },
      { prompt: 'Le maître (pouvoir) répondre à nos questions.', answer: 'Le maître pouvait répondre à nos questions.', verb: 'pouvoir', form: 'pouvait', rule: 'Pouvoir prend le radical pouv- à l’imparfait et la terminaison -ait avec le sujet singulier.' }
    ],
    futur: [
      { prompt: 'Vous (choisir) votre livre pour la semaine.', answer: 'Vous choisirez votre livre pour la semaine.', verb: 'choisir', form: 'choisirez', rule: 'Au futur, pour les verbes du 2e groupe comme choisir, on ajoute -ez à l’infinitif avec vous.' },
      { prompt: 'Je (voir) le résultat dès demain.', answer: 'Je verrai le résultat dès demain.', verb: 'voir', form: 'verrai', rule: 'Au futur, le verbe voir s’écrit avec deux r : je verrai (-ai avec je).' },
      { prompt: 'Nous (venir) vous encourager samedi.', answer: 'Nous viendrons vous encourager samedi.', verb: 'venir', form: 'viendrons', rule: 'Venir prend le radical viendr- au futur : nous viendrons (-ons avec nous).' },
      { prompt: 'Tu (mettre) une veste imperméable.', answer: 'Tu mettras une veste imperméable.', verb: 'mettre', form: 'mettras', rule: 'Mettre prend le radical mettr- au futur et la terminaison -as avec tu : tu mettras.' },
      { prompt: 'Les élèves (aller) visiter le château.', answer: 'Les élèves iront visiter le château.', verb: 'aller', form: 'iront', rule: 'Aller prend le radical ir- au futur et la terminaison -ont à la 3e personne du pluriel.' }
    ],
    compose: [
      { prompt: 'J’ (chanter) dans la chorale de l’école.', answer: 'J’ai chanté dans la chorale de l’école.', verb: 'chanter', form: 'ai chanté', rule: 'Le passé composé se forme avec l’auxiliaire avoir au présent (ai) et le participe passé chanté.' },
      { prompt: 'Nous (finir) notre exercice de calcul.', answer: 'Nous avons fini notre exercice de calcul.', verb: 'finir', form: 'avons fini', rule: 'Avec l’auxiliaire avoir (avons), le participe passé fini ne s’accorde pas avec le sujet.' },
      { prompt: 'Il (prendre) une décision courageuse.', answer: 'Il a pris une décision courageuse.', verb: 'prendre', form: 'a pris', rule: 'Le participe passé de prendre est pris (avec un s muet que l’on entend dans prise).' },
      { prompt: 'Elle (aller) à la médiathèque hier soir.', answer: 'Elle est allée à la médiathèque hier soir.', verb: 'aller', form: 'est allée', rule: 'Aller se conjugue avec l’auxiliaire être : le participe passé s’accorde au féminin singulier (allée).' },
      { prompt: 'Mes amis (partir) en colonie de vacances.', answer: 'Mes amis sont partis en colonie de vacances.', verb: 'partir', form: 'sont partis', rule: 'Partir se conjugue avec être : le participe passé s’accorde au masculin pluriel (partis).' }
    ]
  },
  CM2: {
    present: [
      { prompt: 'Vous (savoir) comment résoudre ce problème.', answer: 'Vous savez comment résoudre ce problème.', verb: 'savoir', form: 'savez', rule: 'Au présent, savoir prend le radical sav- avec vous : vous savez.' },
      { prompt: 'Je (pouvoir) vous prêter mon matériel.', answer: 'Je peux vous prêter mon matériel.', verb: 'pouvoir', form: 'peux', rule: 'Au présent avec je, pouvoir s’écrit je peux (ou je puis dans un registre soutenu).' },
      { prompt: 'Ils (vouloir) présenter leur exposé.', answer: 'Ils veulent présenter leur exposé.', verb: 'vouloir', form: 'veulent', rule: 'À la 3e personne du pluriel au présent, vouloir s’écrit ils veulent.' },
      { prompt: 'Nous (lire) un roman historique en classe.', answer: 'Nous lisons un roman historique en classe.', verb: 'lire', form: 'lisons', rule: 'Lire utilise le radical lis- au présent avec nous : nous lisons.' },
      { prompt: 'Elle (mettre) ses affaires en ordre.', answer: 'Elle met ses affaires en ordre.', verb: 'mettre', form: 'met', rule: 'Mettre prend la terminaison -t à la 3e personne du singulier au présent : elle met.' }
    ],
    imparfait: [
      { prompt: 'Depuis le train, nous (voir) le coucher du soleil.', answer: 'Depuis le train, nous voyions le coucher du soleil.', verb: 'voir', form: 'voyions', rule: 'Attention à l’imparfait : garder le y du radical voy- et ajouter la terminaison -ions : nous voyions.' },
      { prompt: 'Tous les vendredis, vous (prendre) le bus de dix heures.', answer: 'Tous les vendredis, vous preniez le bus de dix heures.', verb: 'prendre', form: 'preniez', rule: 'Prendre prend le radical pren- à l’imparfait et la terminaison -iez avec vous : vous preniez.' },
      { prompt: 'Je (savoir) que l’aventure serait passionnante.', answer: 'Je savais que l’aventure serait passionnante.', verb: 'savoir', form: 'savais', rule: 'Savoir prend le radical sav- à l’imparfait : je savais (-ais avec je).' },
      { prompt: 'Ils (aller) à la répétition chaque semaine.', answer: 'Ils allaient à la répétition chaque semaine.', verb: 'aller', form: 'allaient', rule: 'Avec ils, la terminaison de l’imparfait est toujours -aient : ils allaient.' },
      { prompt: 'Nous (être) réunis pour préparer la fête.', answer: 'Nous étions réunis pour préparer la fête.', verb: 'être', form: 'étions', rule: 'Le verbe être prend le radical ét- et la terminaison -ions avec nous : nous étions.' }
    ],
    futur: [
      { prompt: 'Dès mon arrivée, j’ (envoyer) un message.', answer: 'Dès mon arrivée, j’enverrai un message.', verb: 'envoyer', form: 'enverrai', rule: 'Au futur simple, envoyer prend deux r : j’enverrai (avec la terminaison -ai pour je).' },
      { prompt: 'Ce soir, nous (pouvoir) observer la lune.', answer: 'Ce soir, nous pourrons observer la lune.', verb: 'pouvoir', form: 'pourrons', rule: 'Pouvoir s’écrit avec deux r au futur : nous pourrons (-ons avec nous).' },
      { prompt: 'Tu (savoir) expliquer la règle à tes camarades.', answer: 'Tu sauras expliquer la règle à tes camarades.', verb: 'savoir', form: 'sauras', rule: 'Savoir prend le radical saur- au futur et la terminaison -as avec tu : tu sauras.' },
      { prompt: 'Les invités (venir) assister au spectacle.', answer: 'Les invités viendront assister au spectacle.', verb: 'venir', form: 'viendront', rule: 'Venir prend le radical viendr- et la terminaison -ont au pluriel : les invités viendront.' },
      { prompt: 'Demain matin, ils (mettre) les voiles.', answer: 'Demain matin, ils mettront les voiles.', verb: 'mettre', form: 'mettront', rule: 'Mettre prend le radical mettr- et la terminaison -ont avec ils : ils mettront.' }
    ],
    compose: [
      { prompt: 'Vous (faire) d’immenses progrès ce trimestre.', answer: 'Vous avez fait d’immenses progrès ce trimestre.', verb: 'faire', form: 'avez fait', rule: 'Le participe passé de faire est fait (avec un t muet) : vous avez fait.' },
      { prompt: 'Les témoins (dire) toute la vérité aux enquêteurs.', answer: 'Les témoins ont dit toute la vérité aux enquêteurs.', verb: 'dire', form: 'ont dit', rule: 'Le participe passé de dire est dit (avec un t muet) : ils ont dit.' },
      { prompt: 'J’ (voir) une étoile filante traverser le ciel.', answer: 'J’ai vu une étoile filante traverser le ciel.', verb: 'voir', form: 'ai vu', rule: 'Le participe passé de voir est vu : j’ai vu (auxiliaire avoir).' },
      { prompt: 'La délégation (venir) de très loin pour participer.', answer: 'La délégation est venue de très loin pour participer.', verb: 'venir', form: 'est venue', rule: 'Venir se conjugue avec être : la délégation est féminin singulier, on accorde donc le participe passé (venue).' },
      { prompt: 'Les randonneurs (partir) à l’aube sur le sentier.', answer: 'Les randonneurs sont partis à l’aube sur le sentier.', verb: 'partir', form: 'sont partis', rule: 'Partir se conjugue avec l’auxiliaire être : on accorde au masculin pluriel (partis).' }
    ],
    simple: [
      { prompt: 'Le jeune artiste (chanter) son refrain avec émotion.', answer: 'Le jeune artiste chanta son refrain avec émotion.', verb: 'chanter', form: 'chanta', rule: 'Pour les verbes du 1er groupe, la 3e personne du singulier au passé simple se termine par -a : il chanta.' },
      { prompt: 'Ils (finir) l’ascension de la falaise avant la nuit.', answer: 'Ils finirent l’ascension de la falaise avant la nuit.', verb: 'finir', form: 'finirent', rule: 'Pour les verbes du 2e groupe, la 3e personne du pluriel au passé simple se termine par -irent : ils finirent.' },
      { prompt: 'Ce (être) une journée mémorable pour tous.', answer: 'Ce fut une journée mémorable pour tous.', verb: 'être', form: 'fut', rule: 'Au passé simple, la 3e personne du singulier de être est il fut (sans accent).' },
      { prompt: 'Nous (avoir) le plaisir de partager ce moment.', answer: 'Nous eûmes le plaisir de partager ce moment.', verb: 'avoir', form: 'eûmes', rule: 'Au passé simple avec nous, avoir s’écrit nous eûmes avec un accent circonflexe sur le u.' },
      { prompt: 'Le chevalier (prendre) son bouclier et s’élança.', answer: 'Le chevalier prit son bouclier et s’élança.', verb: 'prendre', form: 'prit', rule: 'Au passé simple, prendre fait il prit (avec un t muet).' }
    ],
    parfait: [
      { prompt: 'J’ (chanter) avant même que le spectacle ne commence.', answer: 'J’avais chanté avant même que le spectacle ne commence.', verb: 'chanter', form: 'avais chanté', rule: 'Le plus-que-parfait se forme avec l’auxiliaire avoir à l’imparfait (avais) et le participe passé (chanté).' },
      { prompt: 'Nous (finir) nos préparatifs quand les invités sonnèrent.', answer: 'Nous avions fini nos préparatifs quand les invités sonnèrent.', verb: 'finir', form: 'avions fini', rule: 'Le plus-que-parfait exprime une action accomplie avant une autre action passée : nous avions fini.' },
      { prompt: 'Il (prendre) soin de ranger ses affaires la veille.', answer: 'Il avait pris soin de ranger ses affaires la veille.', verb: 'prendre', form: 'avait pris', rule: 'Le plus-que-parfait de prendre s’écrit avait pris (participe passé pris avec un s muet).' },
      { prompt: 'Elle (aller) se reposer avant la compétition.', answer: 'Elle était allée se reposer avant la compétition.', verb: 'aller', form: 'était allée', rule: 'Aller se conjugue avec être : le participe passé s’accorde au féminin singulier (était allée).' },
      { prompt: 'Ils (partir) bien avant le lever du jour.', answer: 'Ils étaient partis bien avant le lever du jour.', verb: 'partir', form: 'étaient partis', rule: 'Partir se conjugue avec l’auxiliaire être à l’imparfait : accord au masculin pluriel (étaient partis).' }
    ]
  }
};

export function renderLevelGuide(level, {description, lessonPath, levelPath, levelTensePath, verbLink = v=>v.infinitive}) {
  const guide=levelGuides[level];
  const selection=allowedVerbs(level);
  return `<section class="seo-guide content-panel"><h2>Que réviser en conjugaison en ${level} ?</h2>
    <p>${description}</p><h3>${guide.goal}</h3><p>${guide.method}</p><p>${guide.practice}</p>
    <h3>Les ${selection.length} verbes de la sélection ${level}</h3>
    <p>Voici les verbes que tu peux rencontrer dans les exercices de ce niveau. Les groupes aident à reconnaître des façons de conjuguer ; être et avoir sont présentés à part.</p>
    <div class="verb-selection">${verbCategories.map(category=>{
      const selected=selection.filter(category.includes);
      return selected.length?`<p><strong>${category.label}</strong></p><ul class="verb-list">${selected.map(v=>`<li data-verb="${v.infinitive}">${verbLink(v)}</li>`).join('')}</ul>`:'';
    }).join('')}</div>
    <h3>Les temps à travailler</h3><ul class="lesson-links">${levelTenses[level].map(tense=>`<li><a href="${levelTensePath?levelTensePath(level,tense):lessonPath(tense)}"><strong>${tenses[tense].name} ${level} : exercices et corrigé</strong></a><p>${tenses[tense].tip}</p><p class="memo-example">${tenseExamples[tense].sentence}</p><p><a href="${lessonPath(tense)}" class="text-link">Consulter la fiche générale</a></p></li>`).join('')}</ul>
    <h3>Trois erreurs à comprendre</h3><ul class="help-list">${guide.mistakes.map(m=>`<li><span>Temps travaillé : ${tenses[m.tense].name.toLowerCase()}. À éviter ici : <s>${m.wrong}</s>.</span> <strong>On écrit : ${m.correct}.</strong> ${m.why}</li>`).join('')}</ul>
    <h3>Une petite séance pour essayer</h3><p>Choisis un temps en haut de la page, puis lance une série. Tu peux prendre tout le temps nécessaire en mode entraînement. Lis chaque correction : une erreur t’indique ce que tu peux retravailler.</p>
    <p>Ces activités complètent les leçons de classe. Elles travaillent les verbes au programme du primaire, avec les auxiliaires avoir et être (pour aller, venir, partir).</p>
  </section>`;
}

export function renderLevelTense(level, tense, { lessonPath, levelPath, levelTensePath, verbLink = v=>v.infinitive }) {
  const t = tenses[tense];
  const exercises = levelTenseExercises[level]?.[tense] || [];
  const representativeVerbs = level === 'CE2'
    ? ['être', 'avoir', 'faire', 'aller', 'dire', 'prendre']
    : (level === 'CM1'
      ? ['être', 'avoir', 'aller', 'finir', 'prendre', 'mettre', 'voir', 'pouvoir']
      : ['être', 'avoir', 'aller', 'finir', 'prendre', 'faire', 'mettre', 'voir']);
  const verbObjects = representativeVerbs.map(inf => verbs.find(v => v.infinitive === inf)).filter(Boolean);
  const siblingTenses = levelTenses[level].filter(k => k !== tense);

  return `<nav class="content-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a> / <a href="${levelPath(level)}">Conjugaison ${level}</a> / <span>${t.name}</span></nav>
  <div class="greeting"><div><h1>${t.name} ${level} : exercices et corrigé</h1><p>Entraîne-toi sur ${t.name.toLowerCase()} en ${level} avec le rappel de cours, des exercices d’application corrigés et les tableaux des verbes au programme.</p></div></div>
  <article class="content-panel seo-guide">
    <h2>Rappel de cours : ${t.name.toLowerCase()} en ${level}</h2>
    <p>${t.tip}</p>
    <p class="memo-example"><strong>Exemple modèle :</strong> ${t.example}</p>
    <h3>Les verbes clés travaillés en ${level}</h3>
    <p>À ce niveau, les exercices portent sur les verbes réguliers et les verbes fréquents incontournables : ${verbObjects.map(v => `<strong>${v.infinitive}</strong>`).join(', ')}.</p>
  </article>
  <section class="content-panel seo-guide">
    <h2>Exercices d’application avec corrigé (${level})</h2>
    <p>Complète chaque phrase en conjuguant le verbe entre parenthèses à ${t.name.toLowerCase()}. Ouvre ensuite le corrigé pour vérifier ta réponse et lire l’explication grammaticale.</p>
    <ol class="exercise-list">${exercises.map((ex, i) => `
      <li class="exercise-card">
        <h3>Exercice ${i + 1} : ${ex.verb} à ${t.name.toLowerCase()}</h3>
        <p class="exercise-prompt">${ex.prompt}</p>
        <details class="exercise-solution">
          <summary>Voir le corrigé détaillé</summary>
          <div class="exercise-answer"><strong>Phrase corrigée :</strong> ${ex.answer}</div>
          <p class="exercise-rule"><strong>Règle d’accord :</strong> ${ex.rule}</p>
        </details>
      </li>`).join('')}
    </ol>
  </section>
  <section class="content-panel seo-guide">
    <h2>Tableaux de conjugaison mémo : ${t.name.toLowerCase()}</h2>
    <p>Consulte la conjugaison complète des verbes repères de ${level} pour réviser avant de passer aux exercices interactifs.</p>
    <div class="memo-grid">${verbObjects.slice(0, 4).map(v => `
      <div class="content-panel">
        <h3>Conjuguer ${verbLink(v)}</h3>
        <table class="memo-table">
          <caption>${v.infinitive} — ${t.name.toLowerCase()} (${level})</caption>
          <thead><tr><th scope="col">Sujet</th><th scope="col">Forme conjuguée</th></tr></thead>
          <tbody>${persons.map((person, i) => `<tr><th scope="row">${person}</th><td>${phrase(person, v[tense][i])}</td></tr>`).join('')}</tbody>
        </table>
      </div>`).join('')}
    </div>
  </section>
  <section class="content-panel seo-guide">
    <h2>S’entraîner en ligne sur Verbox</h2>
    <p>Passe à la pratique interactive ! Lance une série de dix questions sur ${t.name.toLowerCase()} en ${level}, avec calcul des points, mode sans chronomètre ou défi chronométré de 90 secondes.</p>
    <div class="public-links">
      <a class="primary-button" href="${levelPath(level)}?temps=${tense}">Lancer les exercices interactifs (${level})</a>
      <a class="secondary-button" href="${lessonPath(tense)}">Fiche de cours générale : ${t.name.toLowerCase()}</a>
    </div>
    <h3>Autres temps au programme de ${level}</h3>
    <ul class="lesson-links">${siblingTenses.map(k => `<li><a href="${levelTensePath(level, k)}"><strong>${tenses[k].name} ${level}</strong> : exercices et corrigé</a><p>${tenses[k].tip}</p></li>`).join('')}</ul>
  </section>`;
}
