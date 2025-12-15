
import fs from 'fs';
import path from 'path';
import https from 'https';

const ASSETS = [
    // --- CMS / LANDING ---
    { url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", path: "public/images/hero-main.jpg" },
    { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", path: "public/images/feat-learning.jpg" },
    { url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80", path: "public/images/feat-arcade.jpg" },
    { url: "https://images.unsplash.com/photo-1511882150382-421056c8d32e?auto=format&fit=crop&w=800&q=80", path: "public/images/feat-progression.jpg" },
    { url: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=800&q=80", path: "public/images/feat-safety.jpg" },

    // --- LIBRARY BOOKS ---
    { url: "https://m.media-amazon.com/images/I/71UypkUjStL._SL1500_.jpg", path: "public/images/books/think-grow-rich.jpg" },
    { url: "https://m.media-amazon.com/images/I/717V4glZ2HL._SL1500_.jpg", path: "public/images/books/mindset.jpg" },
    { url: "https://m.media-amazon.com/images/I/617Zl5b+kLL._SL1500_.jpg", path: "public/images/books/7-habits.jpg" },
    { url: "https://m.media-amazon.com/images/I/81wgcld4wxL._SL1500_.jpg", path: "public/images/books/atomic-habits.jpg" },
    { url: "https://m.media-amazon.com/images/I/71vK0WVQ4rL._SL1500_.jpg", path: "public/images/books/win-friends.jpg" },
    { url: "https://m.media-amazon.com/images/I/71K1jVjF21L._SL1500_.jpg", path: "public/images/books/start-with-why.jpg" },
    { url: "https://m.media-amazon.com/images/I/71R2Nw-jJML._SL1500_.jpg", path: "public/images/books/grit.jpg" },
    { url: "https://m.media-amazon.com/images/I/71uAI28kJuL._SL1500_.jpg", path: "public/images/books/zero-to-one.jpg" },
    { url: "https://m.media-amazon.com/images/I/81L7-M3ZfAL._SL1500_.jpg", path: "public/images/books/blue-ocean.jpg" },
    { url: "https://m.media-amazon.com/images/I/81-QB7nDfRL._SL1500_.jpg", path: "public/images/books/lean-startup.jpg" },
    { url: "https://m.media-amazon.com/images/I/5152h+3yO7L._SL1500_.jpg", path: "public/images/books/hooked.jpg" },
    { url: "https://m.media-amazon.com/images/I/61d1p7KYtLL._SL1500_.jpg", path: "public/images/books/contagious.jpg" },
    { url: "https://m.media-amazon.com/images/I/61N+R-3WdXL._SL1500_.jpg", path: "public/images/books/purple-cow.jpg" },
    { url: "https://m.media-amazon.com/images/I/81bsw6fnUiL._SL1500_.jpg", path: "public/images/books/rich-dad.jpg" },
    { url: "https://m.media-amazon.com/images/I/71u372t-2jL._SL1500_.jpg", path: "public/images/books/richest-man.jpg" },
    { url: "https://m.media-amazon.com/images/I/71TRUbcZikL._SL1500_.jpg", path: "public/images/books/psychology-money.jpg" },
    { url: "https://m.media-amazon.com/images/I/71K7M7+GvLL._SL1500_.jpg", path: "public/images/books/i-will-teach.jpg" },
    { url: "https://m.media-amazon.com/images/I/61+9P+8WcCL._SL1500_.jpg", path: "public/images/books/profit-first.jpg" },
    { url: "https://m.media-amazon.com/images/I/71+vQykCZ+L._SL1500_.jpg", path: "public/images/books/automatic-millionaire.jpg" },
    { url: "https://m.media-amazon.com/images/I/612c1K-qyuL._SL1500_.jpg", path: "public/images/books/shoe-dog.jpg" },
    { url: "https://m.media-amazon.com/images/I/71sV+r3+nRL._SL1500_.jpg", path: "public/images/books/steve-jobs.jpg" },
    { url: "https://m.media-amazon.com/images/I/715s-tQ+j7L._SL1500_.jpg", path: "public/images/books/elon-musk.jpg" },
    { url: "https://m.media-amazon.com/images/I/71+2+1-XjJL._SL1500_.jpg", path: "public/images/books/creativity-inc.jpg" },
    { url: "https://m.media-amazon.com/images/I/61-v-1-q+HL._SL1500_.jpg", path: "public/images/books/made-in-america.jpg" },
    { url: "https://m.media-amazon.com/images/I/71D+1+q+HL._SL1500_.jpg", path: "public/images/books/snowball.jpg" },
    { url: "https://m.media-amazon.com/images/I/81D+1+q+HL._SL1500_.jpg", path: "public/images/books/titan.jpg" },

    // --- CURRICULUM ---
    // Money
    { url: "https://images.unsplash.com/photo-1577253313708-cab167d2c474?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-barter.jpg" },
    { url: "https://images.unsplash.com/photo-1554672723-b208dc2513af?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-coins.jpg" },
    { url: "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-earn.jpg" },
    { url: "https://images.unsplash.com/photo-1579621970563-ebec7560eb3e?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-piggy.jpg" },
    { url: "https://images.unsplash.com/photo-1559589689-577aabd1db4f?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-spend.jpg" },
    { url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-donate.jpg" },
    { url: "https://images.unsplash.com/photo-1601597111158-2fceff292cd4?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-bank.jpg" },
    { url: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-interest.jpg" },
    { url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-budget.jpg" },
    { url: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/money-digital.jpg" },
    // Entrepreneurship
    { url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-biz.jpg" },
    { url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-lemonade.jpg" },
    { url: "https://images.unsplash.com/photo-1459745930869-b3d0d72c3cbb?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-crafts.jpg" },
    { url: "https://images.unsplash.com/photo-1626785774573-4b7993143a2d?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-logo.jpg" },
    { url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-service.jpg" },
    { url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-profit.jpg" },
    { url: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-marketing.jpg" },
    { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-ecommerce.jpg" },
    { url: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-feedback.jpg" },
    { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ent-scale.jpg" },
    // Investing
    { url: "https://images.unsplash.com/photo-1535320903710-d9cf113d2062?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-investing.jpg" },
    { url: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-stock.jpg" },
    { url: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-compound.jpg" },
    { url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-realestate.jpg" },
    { url: "https://images.unsplash.com/photo-1565514020175-05179d48c17f?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-bond.jpg" },
    { url: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-diversify.jpg" },
    { url: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-risk.jpg" },
    { url: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-buffett.jpg" },
    { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-human.jpg" },
    { url: "https://images.unsplash.com/photo-1492138786289-d35ea832da43?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/inv-patience.jpg" },
    // Marketing
    { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-basic.jpg" },
    { url: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-color.jpg" },
    { url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-poster.jpg" },
    { url: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-jingle.jpg" },
    { url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-social.jpg" },
    { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-target.jpg" },
    { url: "https://images.unsplash.com/photo-1589820296156-2454bb8a4d50?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-package.jpg" },
    { url: "https://images.unsplash.com/photo-1559553156-2e9713673c70?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-sample.jpg" },
    { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-celeb.jpg" },
    { url: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/mkt-ethical.jpg" },
    // Leadership (Added)
    { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-leader.jpg" },
    { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-roles.jpg" },
    { url: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-listen.jpg" },
    { url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-compromise.jpg" },
    { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-encourage.jpg" },
    { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-delegate.jpg" },
    { url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-kids.jpg" },
    { url: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-mistakes.jpg" },
    { url: "https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-celebrate.jpg" },
    { url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/ldr-self.jpg" },
    // Economics (Added)
    { url: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-intro.jpg" },
    { url: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-supply.jpg" },
    { url: "https://images.unsplash.com/photo-1610375461246-83648bfb187b?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-scarcity.jpg" },
    { url: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-producer.jpg" },
    { url: "https://images.unsplash.com/photo-1521590832169-7dad1a9b708c?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-goods.jpg" },
    { url: "https://images.unsplash.com/photo-1556742526-795a8eac090e?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-bargain.jpg" },
    { url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-trade.jpg" },
    { url: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-inflation.jpg" },
    { url: "https://images.unsplash.com/photo-1554224154-260327c00c4b?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-taxes.jpg" },
    { url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/eco-recycle.jpg" },
    // Tech (Added)
    { url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-app.jpg" },
    { url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-code.jpg" },
    { url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-ai.jpg" },
    { url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-privacy.jpg" },
    { url: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-3d.jpg" },
    { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-robot.jpg" },
    { url: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-crypto.jpg" },
    { url: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-gig.jpg" },
    { url: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-space.jpg" },
    { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/tech-good.jpg" },
    // Social (Added)
    { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-kind.jpg" },
    { url: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-eco.jpg" },
    { url: "https://images.unsplash.com/photo-1615486511484-92e172cc416d?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-fair.jpg" },
    { url: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-local.jpg" },
    { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-diversity.jpg" },
    { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-animal.jpg" },
    { url: "https://images.unsplash.com/photo-1555874227-38b524bf554d?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-share.jpg" },
    { url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-volunteer.jpg" },
    { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-integrity.jpg" },
    { url: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/soc-change.jpg" },
    // Global (Added)
    { url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-import.jpg" },
    { url: "https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-exchange.jpg" },
    { url: "https://images.unsplash.com/photo-1529101091760-61df6be246b3?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-culture.jpg" },
    { url: "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-time.jpg" },
    { url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-brand.jpg" },
    { url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-logistics.jpg" },
    { url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-language.jpg" },
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-tour.jpg" },
    { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-kid.jpg" },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/glo-virtual.jpg" },
    // Finance (Added)
    { url: "https://images.unsplash.com/photo-1614064641938-3bcee52970f9?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-pass.jpg" },
    { url: "https://images.unsplash.com/photo-1599256621730-d3269f61264c?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-scam.jpg" },
    { url: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-identity.jpg" },
    { url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-accountant.jpg" },
    { url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-contract.jpg" },
    { url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-lock.jpg" },
    { url: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-phish.jpg" },
    { url: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-credit.jpg" },
    { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-data.jpg" },
    { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80", path: "public/images/lessons/fin-grad.jpg" }
];

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    ensureDirectoryExistence(dest);
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
          console.log(`✅ Downloaded: ${dest}`);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {}); // Delete failed file
        console.error(`❌ Failed: ${url} (Status: ${response.statusCode})`);
        resolve(null); // Resolve to keep script running
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error(`❌ Error: ${err.message}`);
      resolve(null);
    });
  });
};

const main = async () => {
    console.log("🚀 Starting Asset Download...");
    
    for (const asset of ASSETS) {
        await download(asset.url, asset.path);
    }
    
    console.log("🏁 Download Complete! Now update your data files to point to these local paths.");
};

main();
