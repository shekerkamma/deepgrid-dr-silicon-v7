'use client';

import {Shell} from '../shell';
import {SectionHead} from '../detail';
import ApplicationsStory from '../applications-story';
import {PRE_SILICON} from '../copy';
import Related from '../related';

export default function Page() {
  return (
    <Shell route="applications">
      <section className="page-wrap">
        <SectionHead
          title="Ten architectures answer five kinds of equipment job"
          copy="Explore DeepGrid’s architecture portfolio by the system each part is intended to serve. Open a chip for what it replaces and its annex sheet; DG32-LITE, the pre-silicon proof point, opens into its diagnostic story and films."
        />
        <ApplicationsStory/>
        <p className="disclaimer">{PRE_SILICON}</p>
      <Related route="applications"/>
      </section>
    </Shell>
  );
}
