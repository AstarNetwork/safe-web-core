import React from 'react'
import css from './styles.module.css'
import WelcomeLogin from './WelcomeLogin'
import WelcomeRightPanel from './WelcomeRightPanel'
import SafeLogo from '@/public/images/logo.svg'
import footerCss from './welcomeFooter.module.css'
import Footer from '../common/Footer'

const NewSafe = () => {
  return (
    <div className={css.loginPage}>
      <div className={css.leftSide}>
        <div className={css.logoContainer}>
          <SafeLogo className={css.logo} />
        </div>
        <div className={css.loginContainer}>
          <WelcomeLogin />
        </div>
        <Footer forceShow versionIcon={false} helpCenter={false} preferences={false} className={footerCss.footer} />
      </div>

      <div className={css.rightSide}>
        <WelcomeRightPanel />
      </div>
    </div>
  )
}

export default NewSafe
