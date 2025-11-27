import AceiteVegetal from '../assets/Aceite Vegetal 1 L.png'
import AceiteDeOliva from '../assets/Aceite de Oliva 500 ml.png'
import VinagreBlanco from '../assets/Vinagre Blanco 500 ml.png'
import Oregano from '../assets/Orégano 30 g.png'
import PimientaMolida from '../assets/Pimienta Molida 50 g.png'
import AzucarRubia from '../assets/Azúcar Rubia 1 kg.png'
import HarinaDeTrigo from '../assets/Harina de Trigo 1 kg.png'
import TomateEnlatado from '../assets/Tomate Enlatado 400 g.png'
import AtunEnLata from '../assets/Atún en Lata 170 g.png'
import ArrozSuperior from '../assets/Arroz Superior 1 kg.png'
import PastaSpaghetti from '../assets/Pasta Spaghetti 500 g.png'
import CaramelosSurtidos from '../assets/Caramelos Surtidos 150 g.png'
import ChocolateBitter from '../assets/Chocolate Bitter 80 g.png'
import GalletasSaladas from '../assets/Galletas Saladas 120 g.png'
import GalletasChocolate from '../assets/Galletas de Chocolate 120 g.png'
import BarraEnergetica from '../assets/Barra Energética 50 g.png'
import SemillasDeChia from '../assets/Semillas de Chía 250 g.png'
import MixFrutosSecos from '../assets/Mix Frutos Secos 150 g.png'
import Nachos from '../assets/Nachos 200 g.png'
import PapasFritas from '../assets/Papas Fritas 90 g.png'
import GomitasSurtidas from '../assets/Gomitas Surtidas 130g.png'
import TeVerde from '../assets/Té Verde 20 u.png'
import CafeMolido from '../assets/Café Molido 250 g.png'
import PanIntegral from '../assets/Pan Integral 500 g.png'
import MantequillaDeMani from '../assets/Mantequilla de Maní 340 g.png'
import MermeladaDeFresa from '../assets/Mermelada de Fresa 250 g.png'
import BebidaVegetal from '../assets/Bebida Vegetal 1 L.png'
import LecheEntera from '../assets/Leche Entera 1 L.png'
import Granola from '../assets/Granola 400 g.png'
import CerealCrujiente from '../assets/Cereal Crujiente 500 g.png'
import YogurtLight from '../assets/Yogurt Light 390g.png'
import AmbientadorAerosol from '../assets/Ambientador Aerosol 200 ml.png'
import KitLimpiezaHogar from '../assets/Kit Limpieza Hogar.png'
import JabonCorporal from '../assets/Jabón Corporal 750 ml.png'
import JabonDeManos from '../assets/Jabón de Manos 250 ml.png'
import LimpiadorDePiso from '../assets/Limpiador de Piso 900 ml.png'
import DesinfectanteMultiusos from '../assets/Desinfectante Multiusos 1 L.png'
import Lavavajillas from '../assets/Lavavajillas 750 ml.png'
import DetergenteRopa from '../assets/Detergente Ropa 1 kg.png'
import PapelToalla from '../assets/Papel Toalla 12un.png'
import VinoTintoReserva from '../assets/Vino Tinto Reserva 750 ml.png'
import Isotonica from '../assets/Isotónica 500 ml.png'
import BebidaEnergetica from '../assets/Bebida Energética 473 ml.png'
import AguaSaborizada from '../assets/Agua Saborizada 600 ml.png'
import JugoNaturalMix from '../assets/Jugo Natural Mix 300 ml.png'
import JugoNaranja from '../assets/Jugo Naranja 1 L.png'
import SodaLimon from '../assets/Soda Limón 1.5 L.png'
import RefrescoCola from '../assets/Refresco Cola 500 ml.png'
import CervezaPack6 from '../assets/Cerveza Pack 6.png'
import EspumanteRubi from '../assets/Espumante Rubí 750 ml.png'
import AguaMineral from '../assets/Agua Mineral 625 ml.png'

const assetsByName: Record<string, string> = {
  'Aceite Vegetal 1 L': AceiteVegetal,
  'Aceite de Oliva 500 ml': AceiteDeOliva,
  'Vinagre Blanco 500 ml': VinagreBlanco,
  'Orégano 30 g': Oregano,
  'Pimienta Molida 50 g': PimientaMolida,
  'Azúcar Rubia 1 kg': AzucarRubia,
  'Harina de Trigo 1 kg': HarinaDeTrigo,
  'Tomate Enlatado 400 g': TomateEnlatado,
  'Atún en Lata 170 g': AtunEnLata,
  'Arroz Superior 1 kg': ArrozSuperior,
  'Pasta Spaghetti 500 g': PastaSpaghetti,
  'Caramelos Surtidos 150 g': CaramelosSurtidos,
  'Chocolate Bitter 80 g': ChocolateBitter,
  'Galletas Saladas 120 g': GalletasSaladas,
  'Galletas de Chocolate 120 g': GalletasChocolate,
  'Barra Energética 50 g': BarraEnergetica,
  'Semillas de Chía 250 g': SemillasDeChia,
  'Mix Frutos Secos 150 g': MixFrutosSecos,
  'Nachos 200 g': Nachos,
  'Papas Fritas 90 g': PapasFritas,
  'Gomitas Surtidas 130g': GomitasSurtidas,
  'Té Verde 20 u': TeVerde,
  'Café Molido 250 g': CafeMolido,
  'Pan Integral 500 g': PanIntegral,
  'Mantequilla de Maní 340 g': MantequillaDeMani,
  'Mermelada de Fresa 250 g': MermeladaDeFresa,
  'Bebida Vegetal 1 L': BebidaVegetal,
  'Leche Entera 1 L': LecheEntera,
  'Granola 400 g': Granola,
  'Cereal Crujiente 500 g': CerealCrujiente,
  'Yogurt Light 390g': YogurtLight,
  'Ambientador Aerosol 200 ml': AmbientadorAerosol,
  'Kit Limpieza Hogar': KitLimpiezaHogar,
  'Jabón Corporal 750 ml': JabonCorporal,
  'Jabón de Manos 250 ml': JabonDeManos,
  'Limpiador de Piso 900 ml': LimpiadorDePiso,
  'Desinfectante Multiusos 1 L': DesinfectanteMultiusos,
  'Lavavajillas 750 ml': Lavavajillas,
  'Detergente Ropa 1 kg': DetergenteRopa,
  'Papel Toalla 12un': PapelToalla,
  'Vino Tinto Reserva 750 ml': VinoTintoReserva,
  'Isotónica 500 ml': Isotonica,
  'Bebida Energética 473 ml': BebidaEnergetica,
  'Agua Saborizada 600 ml': AguaSaborizada,
  'Jugo Natural Mix 300 ml': JugoNaturalMix,
  'Jugo Naranja 1 L': JugoNaranja,
  'Soda Limón 1.5 L': SodaLimon,
  'Refresco Cola 500 ml': RefrescoCola,
  'Cerveza Pack 6': CervezaPack6,
  'Espumante Rubí 750 ml': EspumanteRubi,
  'Agua Mineral 625 ml': AguaMineral,
}

export function getAsset(name: string): string | undefined {
  return assetsByName[name]
}
