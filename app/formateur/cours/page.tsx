import { redirect } from 'next/navigation'

// Cette page faisait doublon avec /formateur/mes-cours (deux listes de cours
// divergentes, l'une renvoyant vers /formateur/player, l'autre vers
// /formateur/viewer). On la fait converger vers la version de référence.
export default function FormateurCoursRedirect() {
  redirect('/formateur/mes-cours')
}
